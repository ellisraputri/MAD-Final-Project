import { error401, error403 } from "../config/error.js";
import { auth } from "../config/firestore.js";

export const authenticate = async (req, res, next) => {
  const authHeader = req.headers.authorization;

  if (!authHeader || !authHeader.startsWith("Bearer ")) {
    return error401(res);
  }

  const idToken = authHeader.split("Bearer ")[1];

  try {
    const decodedToken = await auth.verifyIdToken(idToken);
    req.user = decodedToken; 
    next();
  } catch (error) {
    console.error("Token verification failed:", error.message);
    return error403(res);
  }
};