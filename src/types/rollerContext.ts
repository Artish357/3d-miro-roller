import { createContext } from "react";
import { HistoricalRollResult, RollHistory } from "./historicalRollResult";

export type RollerContext = {
  rollHistory: RollHistory;
  userInfo: { id: string; name: string };
  panelData: Promise<{ formulas: string[]; description?: string } | undefined>;
  storeRollResult: (result: HistoricalRollResult) => void;
  clearRollHistory: () => void;
};

export const RollerContext = createContext<RollerContext>({
  rollHistory: [],
  userInfo: { id: "", name: "" },
  panelData: new Promise((resolve) => resolve(undefined)),
  storeRollResult: () => {},
  clearRollHistory: () => {},
});
