import { studentModel } from "../models/student.js";
import { db } from "../config/firestore.js";

export const login = (req, res) => {
  try {
   return res.json({
      success: true,
      message: `Hello user ${req.user.email}`,
    }) 
  } catch (error) {
    console.error(error)
    return res.status(500).json({
      success: false,
      message: "Something went wrong. Please try again.",
    });
  }
}

export const register = async (req, res) => {
  try {
    const user = req.user; // from middleware

    const userRef = db.collection("students").doc(user.uid);
    const doc = await userRef.get();

    if (!doc.exists) {
      const studentData = studentModel({
        id: user.uid,
        email: user.email,
        firstName: req.body.firstName,
        grade: req.body.grade,
        appearance: true,
        teamId: null,
      });

      await userRef.set(studentData);
    }

    return res.json({
      success: true,
      message: "User saved successfully",
    });

  } catch (error) {
    console.error(error);
    return res.status(500).json({
      success: false,
      message: "Something went wrong. Please try again.",
    });
  }
};

export const getDetail = async (req, res) => {
  try {
    const user = req.user; // from middleware

    const userRef = db.collection("students").doc(user.uid);
    const doc = await userRef.get();

    if (!doc.exists) {
      return res.status(400).json({
        success: false,
        message: "User not found",
      });
    }

    return res.json({
      user: doc.data(), 
      success: true,
      message: "User found",
    });

  } catch (error) {
    console.error(error);
    return res.status(500).json({
      success: false,
      message: "Something went wrong. Please try again.",
    });
  }
};