import { createContext } from "react";
import { HistoricalRollResult, RollHistory } from "./historicalRollResult";

export interface PanelData {
  rolls: { formula: string; rollId: string }[];
  description?: string;
}

export type RollerContext = {
  rollHistory: RollHistory;
  userInfo: { id: string; name: string };
  panelData: Promise<PanelData | undefined>;
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
