import { auth } from "../config/firestore.js";

export const authenticate = async (req, res, next) => {
  const authHeader = req.headers.authorization;
  console.log("authHeader", authHeader)

  if (!authHeader || !authHeader.startsWith("Bearer ")) {
    return res.status(401).send("Unauthorized");
  }

  const idToken = authHeader.split("Bearer ")[1];

  try {
    const decodedToken = await auth.verifyIdToken(idToken);
    req.user = decodedToken; 
    next();
  } catch (error) {
    console.error("Token verification failed:", error.message);
    res.status(403).send("Invalid Token");
  }
};