import { StudentDetail } from "@/services/student/student.type";
import { TeamDetail } from "@/services/team/team.type";
import React, { createContext, useContext, useState, ReactNode } from "react";

type AppContextType = {
  user: StudentDetail | null;
  setUser: (user: StudentDetail | null) => void;
  team: TeamDetail | null;
  setTeam: (team: TeamDetail | null) => void;
};

const AppContext = createContext<AppContextType | undefined>(undefined);

export const AppProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState<StudentDetail | null>(null);
  const [team, setTeam] = useState<TeamDetail | null>(null);

  return (
    <AppContext.Provider value={{ user, setUser, team, setTeam }}>
      {children}
    </AppContext.Provider>
  );
};

export const useAppContext = () => {
  const context = useContext(AppContext);
  if (!context) {
    throw new Error("useAppContext must be used inside AppProvider");
  }
  return context;
};