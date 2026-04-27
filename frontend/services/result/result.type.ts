import { MediaDetail } from "../media/media.type";
import {
  ActivityOneOutcome,
  ActivitySevenOutcome,
  ActivityThreeOutcome,
  ActivityBaseOutcome,
  ActivityTwoOutcome,
} from "./outcome.type";
import { ActivityOnePrediction, BasePrediction } from "./prediction.type";

export type ResultBaseResponse = {
  success: boolean;
  message: string;
};

export type SubmitResultResponse = ResultBaseResponse & {
  resultId: string;
};

export type SubmitResultRequest = {
  activityId: string;
  teamId: string;
  medias: string[];
  predictions: object[];
};

export type GetResultListRequest = {
  activityId: string;
  teamId: string;
};

export type ResultList = {
  resultId: string;
  score: number;
  attempt: number;
};

export type GetResultListResponse = {
  data: ResultList[];
  success: boolean;
  message: string;
};

export type GetResultDetailRequest = {
  resultId: string;
};

export type GetResultDetailResponse = {
  success: boolean;
  message: string;
  data: ResultDetail | null;
};

export type SubmitRatingRequest = {
  resultId: string;
  ratings?: number;
  comments?: string;
};

export type ResultDetailBase = {
  resultId: string;
  teamId: string;
  attemptNo: number;
  score: number;
  medias: MediaDetail[];
  ratings: number;
  comments: string;
};

export type ResultDetailActivityOne = ResultDetailBase & {
  activityId: 1;
  outcomes: ActivityOneOutcome[];
  predictions: ActivityOnePrediction[];
};

export type ResultDetailActivityTwo = ResultDetailBase & {
  activityId: 2;
  outcomes: ActivityTwoOutcome[];
  predictions: BasePrediction[];
};

export type ResultDetailActivityThree = ResultDetailBase & {
  activityId: 3;
  outcomes: ActivityThreeOutcome[];
  predictions: BasePrediction[];
};

export type ResultDetailActivityFour = ResultDetailBase & {
  activityId: 4;
  outcomes: ActivityBaseOutcome[];
  predictions: BasePrediction[];
};

export type ResultDetailActivityFive = ResultDetailBase & {
  activityId: 5;
  outcomes: ActivityBaseOutcome[];
  predictions: BasePrediction[];
};

export type ResultDetailActivitySix = ResultDetailBase & {
  activityId: 6;
  outcomes: ActivityBaseOutcome[];
  predictions: BasePrediction[];
};

export type ResultDetailActivitySeven = ResultDetailBase & {
  activityId: 7;
  outcomes: ActivitySevenOutcome[];
  predictions: BasePrediction[];
};

export type ResultDetail =
  | ResultDetailActivityOne
  | ResultDetailActivityTwo
  | ResultDetailActivityThree
  | ResultDetailActivityFour
  | ResultDetailActivityFive
  | ResultDetailActivitySix
  | ResultDetailActivitySeven;
