import { studentModel } from "../models/student.js";
import { db } from "../config/firestore.js";

export const login = (req, res) => {
    return res.json({
        message: `Hello user ${req.user.email}`,
    })
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
        firstName: req.firstName,
        grade: req.grade,
        appearance: true,
        teamId: null,
      });

      await userRef.set(studentData);
    }

    return res.json({
      message: "User saved successfully",
    });

  } catch (error) {
    console.error(error);
    res.status(500).send("Error saving user");
  }
};