import { apiClient, auth } from "../firebase";
import {
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  signOut,
} from "firebase/auth";
import {
  LoginRequest,
  LoginResponse,
  RegisterRequest,
  RegisterResponse,
} from "./auth.type";
import { createDefaultError } from "@/constants/error";

export const loginAndGetData = async (
  req: LoginRequest
): Promise<LoginResponse> => {
  try {
    const userCredential = await signInWithEmailAndPassword(
      auth,
      req.email,
      req.password
    );
    const idToken = await userCredential.user.getIdToken();

    console.log("idToken", idToken);

    const response = await apiClient.post(
      "/api/auth/login",
      {},
      {
        headers: {
          Authorization: `Bearer ${idToken}`,
        },
      }
    );
    return response.data;
  } catch (error: any) {
    console.error("Error:", error);
    return createDefaultError(error.response.data.message);
  }
};

export const registerAndGetData = async (
  req: RegisterRequest
): Promise<RegisterResponse> => {
  try {
    const userCredential = await createUserWithEmailAndPassword(
      auth,
      req.email,
      req.password
    );
    const idToken = await userCredential.user.getIdToken();

    console.log("id token ", idToken);

    const response = await apiClient.post(
      "/api/auth/register",
      {
        firstName: req.firstName,
        grade: req.grade,
      },
      {
        headers: {
          Authorization: `Bearer ${idToken}`,
        },
      }
    );

    return response.data;
  } catch (error: any) {
    console.error("Error:", error.message);
    return createDefaultError(error.response.data.message);
  }
};

export const logout = async () => {
  try {
    await signOut(auth);
    return {
      message: "Logout success",
      success: true,
    };
  } catch (error: any) {
    console.error("Logout error:", error.message);
    return createDefaultError(error.response.data.message);
  }
};
