export type DieResult = { value: number; sides: number };
export type HistoricalRollResult = {
  userName: string;
  timestamp: string;
  originalFormula: string;
  rolls: DieResult[][];
  modifier: number;
  total: number;
};
