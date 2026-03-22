import axios from 'axios';
import { auth } from './firebase';
import { signInWithEmailAndPassword } from "firebase/auth";

const apiClient = axios.create({
  baseURL: process.env.EXPO_PUBLIC_API_URL,
});

export const loginAndGetData = async (email, password) => {
  try {
    const userCredential = await signInWithEmailAndPassword(auth, email, password);
    const idToken = await userCredential.user.getIdToken();

    console.log(userCredential)
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