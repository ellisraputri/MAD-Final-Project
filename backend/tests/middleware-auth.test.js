import { authenticate } from "../middleware/auth.js";

import { auth } from "../config/firestore.js";

import { error401, error403 } from "../config/error.js";

jest.mock("../utils/analyze_activity1.js", () => ({
  analyzeVideo: jest.fn(),
}));

jest.mock("../utils/analyze_activity3.js", () => ({
  analyzeVideo3: jest.fn(),
}));

jest.mock("../utils/analyze_activity7.js", () => ({
  analyzeBreathing: jest.fn(),
}));

jest.mock("../config/firestore.js", () => ({
  auth: {
    verifyIdToken: jest.fn(),
  },
}));

jest.mock("../config/error.js", () => ({
  error401: jest.fn(),
  error403: jest.fn(),
}));

describe("Authenticate Middleware", () => {
  let req;
  let res;
  let next;

  beforeEach(() => {
    jest.resetAllMocks();

    req = {
      headers: {},
    };

    res = {};

    next = jest.fn();
  });

  it("should return 401 if no authorization header", async () => {
    await authenticate(req, res, next);

    expect(error401).toHaveBeenCalled();

    expect(next).not.toHaveBeenCalled();
  });

  it("should return 401 if authorization is invalid", async () => {
    req.headers.authorization = "Invalid token";

    await authenticate(req, res, next);

    expect(error401).toHaveBeenCalled();

    expect(next).not.toHaveBeenCalled();
  });

  it("should authenticate valid token", async () => {
    req.headers.authorization =
      "Bearer valid_token";

    auth.verifyIdToken.mockResolvedValue({
      uid: "user123",
      email: "test@mail.com",
    });

    await authenticate(req, res, next);

    expect(auth.verifyIdToken)
      .toHaveBeenCalledWith("valid_token");

    expect(req.user.uid).toBe("user123");

    expect(next).toHaveBeenCalled();
  });

  it("should return 403 if token verification fails", async () => {
    req.headers.authorization =
      "Bearer invalid_token";

    auth.verifyIdToken.mockRejectedValue(
      new Error("Invalid token")
    );

    await authenticate(req, res, next);

    expect(error403).toHaveBeenCalled();

    expect(next).not.toHaveBeenCalled();
  });
});