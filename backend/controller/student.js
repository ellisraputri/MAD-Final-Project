import { studentModel } from "../models/student.js";
import { db } from "../config/firestore.js";
import { error400, error500 } from "../config/error.js";

export const login = (req, res) => {
  try {
   return res.status(200).json({
      success: true,
      message: `Hello user ${req.user.email}`,
    }) 
  } catch (error) {
    console.error(error)
    return error500(res)
  }
}

export const register = async (req, res) => {
  try {
    const user = req.user; // from middleware

    const userRef = db.collection("students").doc(user.uid);
    const doc = await userRef.get();

    if (!doc.exists) {
      const studentData = studentModel({
        email: user.email,
        firstName: req.body.firstName,
        grade: Number(req.body.grade),
        appearance: true,
        teamId: null,
      });

      await userRef.set(studentData);
    }

    return res.status(200).json({
      success: true,
      message: "User saved successfully",
    });

  } catch (error) {
    console.error(error);
    return error500(res);
  }
};

export const getDetail = async (req, res) => {
  try {
    const user = req.user; // from middleware

    const userRef = db.collection("students").doc(user.uid);
    const doc = await userRef.get();

    if (!doc.exists) {
      return error400(res, "User not found");
    }

    return res.status(200).json({
      user: {
        id: doc.id,
        ...doc.data()
      }, 
      success: true,
      message: "User found",
    });

  } catch (error) {
    console.error(error);
    return error500(res);
  }
};

export const updateDetail = async (req, res) => {
  try {
    const user = req.user; // from middleware
    const { firstName, appearance } = req.body; 

    const userRef = db.collection("students").doc(user.uid);
    const doc = await userRef.get();
    if (!doc.exists) {
      return error400(res, "User not found");
    }

    await userRef.update({
      ...(firstName && { firstName }),
      ...(appearance !== undefined && { appearance }),
    });

    return res.status(200).json({
      success: true,
      message: "User updated successfully",
    });

  } catch (error) {
    console.error(error);
    return error500(res);
  }
};