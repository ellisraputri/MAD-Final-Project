import { db } from "../config/firestore.js";
import { error400, error500 } from "../config/error.js";
import { teamModel } from "../models/team.js";
import { FieldPath } from "firebase-admin/firestore";
import cacheService from "../config/caching.js";


const generateId = (length = 6) => {
  const characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
  let result = '';
  for (let i = 0; i < length; i++) {
    result += characters.charAt(Math.floor(Math.random() * characters.length));
  }
  return result;
};

export const createTeam = async (req, res) => {
  try {
    const user = req.user;
    const { name, grade } = req.body;

    if (!name || !grade) {
      return error400(res, "Team name is required");
    }

    const userRef = db.collection("students").doc(user.uid);
    const userDoc = await userRef.get();

    if (!userDoc.exists) {
      return error400(res, "User not found.");
    }

    const userData = userDoc.data();
    if (userData.teamId) {
      return error400(res, "User already has a team.");
    }
    if(userData.grade !== grade){
        return error400(res, "Team's grade level needs to be the same as user's.")
    }

    const customId = generateId(6);
    const teamRef = db.collection('teams').doc(customId); 

    const teamData = teamModel({
      name: name,
      grade: grade,
      logo: "https://static.vecteezy.com/system/resources/previews/036/280/650/non_2x/default-avatar-profile-icon-social-media-user-image-gray-avatar-icon-blank-profile-silhouette-illustration-vector.jpg",
    });

    await teamRef.set(teamData);
    await userRef.update({
      teamId: customId,
    });

    cacheService.del(`student.${user.uid}`);

    return res.status(200).json({
      success: true,
      message: "Team created successfully",
    });

  } catch (error) {
    console.error(error);
    return error500(res);
  }
};

export const joinTeam = async (req, res) => {
  try {
    const user = req.user;
    const { teamId } = req.body;

    if (!teamId) {
      return error400(res, "Team ID is required");
    }

    const userRef = db.collection("students").doc(user.uid);
    const userDoc = await userRef.get();
    if (!userDoc.exists) {
      return error400(res, "User not found.");
    }

    const teamRef = db.collection("teams").doc(teamId);
    const teamDoc = await teamRef.get();
    if (!teamDoc.exists) {
      return error400(res, "Team not found.");
    }

    const userData = userDoc.data();
    const teamData = teamDoc.data();

    if (userData.teamId) {
      return error400(res, "User already has a team.");
    }
    if(userData.grade !== teamData.grade){
        return error400(res, "Team's grade level needs to be the same as user's.")
    }

    await userRef.update({
      teamId: teamId,
    });

    cacheService.del(`student.${user.uid}`);

    return res.status(200).json({
      success: true,
      message: "Team joined successfully",
    });

  } catch (error) {
    console.error(error);
    return error500(res);
  }
};

export const getDetail = async (req, res) => {
  try {
    const teamId = req.params.id;

    const cached = cacheService.get(`team.${teamId}`);
    if (cached) {
      return res.status(200).json({
        success: true,
        message: "Team found",
        team: cached,
      });
    }

    const teamRef = db.collection("teams").doc(teamId);
    const teamDoc = await teamRef.get();

    if (!teamDoc.exists) {
      return error400(res, "Team not found");
    }

    const studentsRef = db.collection("students");
    const snapshot = await studentsRef.where("teamId", "==", teamId).get();
    const members = snapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data(),
    }));

    cacheService.set(`team.${teamId}`, {
      id: teamDoc.id,
      ...teamDoc.data(),
      members: members,
    });

    return res.status(200).json({
      team: {
        id: teamDoc.id,
        ...teamDoc.data(),
        members: members,
      },
      success: true,
      message: "Team found",
    });

  } catch (error) {
    console.error(error);
    return error500(res);
  }
};

export const editDetail = async (req, res) => {
  try {
    const { teamId, name, logoUrl } = req.body;
    if (!teamId) {
      return error400(res, "Team ID is required");
    }

    const teamRef = db.collection("teams").doc(teamId);
    const teamDoc = await teamRef.get();
    if (!teamDoc.exists) {
      return error400(res, "Team not found.");
    }

    await teamRef.update({
      name: name,
      logo: logoUrl
    });

    cacheService.del(`team.${teamId}`);

    return res.status(200).json({
      success: true,
      message: "Team edited successfully",
    });

  } catch (error) {
    console.error(error);
    return error500(res);
  }
};

export const getDetailBatch = async (req, res) => {
  try {
    const {teamIds} = req.body;

    let nowTeamIds = [];
    let teams = [];

    for (const teamId of teamIds){
      const cached = cacheService.get(`team.${teamId}`);
      if (cached) {
        teams.push(cached);
      } else {
        nowTeamIds.push(teamId);
      }
    }

    const snapshot = await db
      .collection("teams")
      .where(FieldPath.documentId(), "in", nowTeamIds)
      .get();

    const teams2 = snapshot.docs.map(doc => {
      const teamDetail = {
        id: doc.id,
        name: doc.data().name,
        logo: doc.data().logo
      }

      cacheService.set(`team.${doc.id}`, teamDetail);
      return teamDetail;
    });
    teams.push(...teams2);

    return res.status(200).json({
      teams,
      success: true,
      message: "Team found",
    });

  } catch (error) {
    console.error(error);
    return error500(res);
  }
};