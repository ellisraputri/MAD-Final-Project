import { saveTeamResult67 } from "../controller/result.js";

export const registerTeamSocket = (io) => {
  const teamMembers = new Map();
  // teamId -> Map(userId -> { userId, name })

  const socketToTeam = new Map();
  // socket.id -> { teamId, userId }

  const teamToResult = new Map();
  // teamId -> Map<userId, result>

  io.on("connection", (socket) => {
    socket.on("join_team", ({ teamId, user }) => {
      console.log("RAW DATA:", { teamId, user });

      if (!teamId || !user?.userId) return;

      const { userId, name } = user;

      console.log(`✅ user ${name} (${userId}) joined team ${teamId}`);

      socket.join(teamId);

      socketToTeam.set(socket.id, { teamId, userId });

      // init team map
      if (!teamMembers.has(teamId)) {
        teamMembers.set(teamId, new Map());
      }

      const teamMap = teamMembers.get(teamId);

      // store full user object
      teamMap.set(userId, { userId, name });

      // 🔥 broadcast FULL USER LIST
      const users = Array.from(teamMap.values());

      io.to(teamId).emit("team_active_users", {
        teamId,
        users,
      });
    });

    socket.on("get_team_active_users", ({ teamId }) => {
      if (!teamId) return;

      const teamMap = teamMembers.get(teamId);
      const users = teamMap ? Array.from(teamMap.values()) : [];

      socket.emit("team_active_users", {
        teamId,
        users,
      });
    });

    socket.on("submit_result_user", async ({ teamId, activityId, result }) => {
      if (!teamId || !activityId) return;

      // init maps
      if (!teamToResult.has(teamId)) {
        teamToResult.set(teamId, new Map());
      }

      const activityMap = teamToResult.get(teamId);

      if (!activityMap.has(activityId)) {
        activityMap.set(activityId, new Map());
      }

      const resultsMap = activityMap.get(activityId);

      // ✅ prevent duplicate per user
      resultsMap.set(result.userId, result);

      const teamMap = teamMembers.get(teamId);
      const users = teamMap ? Array.from(teamMap.values()) : [];

      const isDone = resultsMap.size === users.length;

      // ✅ broadcast progress
      io.to(teamId).emit("submit_result_done", {
        activityId,
        isDone,
      });

      // 🔥 ONLY BACKEND SAVES (ONCE)
      if (isDone) {
        try {
          const allResults = Array.from(resultsMap.values());

          // 👉 call your controller / service directly
          await saveTeamResult67({
            teamId,
            activityId,
            results: allResults,
          });

          console.log("✅ Team result saved once");
        } catch (err) {
          console.error("❌ Failed to save team result", err);
        }
      }
    });

    socket.on("disconnect", () => {
      const data = socketToTeam.get(socket.id);
      if (!data) return;

      const { teamId, userId } = data;

      const teamMap = teamMembers.get(teamId);

      if (teamMap) {
        teamMap.delete(userId);

        if (teamMap.size === 0) {
          teamMembers.delete(teamId);
        }
      }

      socketToTeam.delete(socket.id);

      const users = teamMap ? Array.from(teamMap.values()) : [];

      io.to(teamId).emit("team_active_users", {
        teamId,
        users,
      });

      console.log(`❌ user ${userId} disconnected from team ${teamId}`);
    });
  });
};
