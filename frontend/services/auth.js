import { apiClient, auth } from './firebase';
import { createUserWithEmailAndPassword, signInWithEmailAndPassword, signOut } from "firebase/auth";

export const loginAndGetData = async (email, password) => {
  try {
    const userCredential = await signInWithEmailAndPassword(auth, email, password);
    const idToken = await userCredential.user.getIdToken();

    console.log("idToken", idToken)

    const response = await apiClient.post('/api/auth/login', {}, {
      headers: {
        Authorization: `Bearer ${idToken}`
      }
    });

    return response.data;
  } catch (error) {
    console.error("Error status:", error.response?.status);
    console.error("Error message:", error.message);
  }
};

export const registerAndGetData = async (email, password, firstName, grade) => {
  try {
    const userCredential = await createUserWithEmailAndPassword(auth, email, password);
    const idToken = await userCredential.user.getIdToken();

    console.log("id token register", idToken);

    const response = await apiClient.post("/api/auth/register", 
      {
        firstName: firstName, 
        grade: grade,
      }, 
      {
        headers: {
          Authorization: `Bearer ${idToken}`,
        },
      }
    );

    return response.data;
  } catch (error) {
    console.error("Register error:", error.message);
  }
};

export const logout = async () => {
  try {
    await signOut(auth);
    console.log("User logged out");
  } catch (error) {
    console.error("Logout error:", error.message);
  }
};