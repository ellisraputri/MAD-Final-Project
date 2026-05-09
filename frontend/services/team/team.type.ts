import { RNFile } from "../media/media.type";
import { StudentDetail } from "../student/student.type";

export type TeamDetail = {
  id: string;
  grade: number;
  name: string;
  logo: string;
  members: StudentDetail[];
};

export type TeamDetailResponse = {
  team: TeamDetail | null;
  success: boolean;
  message: string;
};

export type CreateTeamRequest = {
  name: string;
  grade: number;
};

export type JoinTeamRequest = {
  teamId: string;
};

export type EditTeamRequest = {
  teamId: string;
  name: string;
  file?: RNFile;
  logoUrl: string;
};

export type TeamBaseResponse = {
  success: boolean;
  message: string;
};

export type TeamBatchDetailRequest = {
  teamIds: string[];
};

export type TeamBasicDetail = {
  id: string;
  name: string;
  logo: string;
};

export type TeamBatchDetailResponse = {
  teams: TeamBasicDetail[];
  success: boolean;
  message: string;
};
