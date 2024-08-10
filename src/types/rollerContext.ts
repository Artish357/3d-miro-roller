import { createContext } from "react";
import { HistoricalRollResult } from "./historicalRollResult";

export type RollerContext = {
  rollHistory: HistoricalRollResult[];
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
