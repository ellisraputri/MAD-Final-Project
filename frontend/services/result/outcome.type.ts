export type ActivityOneOutcome = {
  touch_time: number;
  score: number;
  prediction: number;
};

export type ActivityThreeOutcome = {
  max_bend: number;
  score: number;
  prediction: number;
};

export type ActivitySevenOutcome = {
  breath_count: number;
  bpm: number;
  score: number;
  prediction: number;
};

export type ActivityTwoOutcome = {
  outcome: number;
  score: number;
  realOutcome: number;
};

export type ActivityBaseOutcome = {
  outcome: number;
  score: number;
};
