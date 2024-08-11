export type DieResult = { value: number; sides: number };

type HistoricalRollResultBase = {
  id: string;
  userName: string;
  timestamp: string;
  originalFormula: string;
  description?: string;
  type: string;
};

export interface CompletedRoll extends HistoricalRollResultBase {
  type: "completed";
  total: number;
  result: string;
}

export interface RollInProgress extends HistoricalRollResultBase {
  type: "inProgress";
}

export type HistoricalRollResult = CompletedRoll | RollInProgress;
export type RollHistory = HistoricalRollResult[];
