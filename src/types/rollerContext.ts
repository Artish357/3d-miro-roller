import { createContext } from "react";
import { HistoricalRollResult, RollHistory } from "./historicalRollResult";

export type RollerContext = {
  rollHistory: RollHistory;
  userInfo: { id: string; name: string };
  panelData: Promise<{ formulas: string[] } | undefined>;
  storeRollResult: (result: HistoricalRollResult) => void;
};

export const RollerContext = createContext<RollerContext>({
  rollHistory: [],
  userInfo: { id: "", name: "" },
  panelData: new Promise((resolve) => resolve(undefined)),
  storeRollResult: () => {},
});
