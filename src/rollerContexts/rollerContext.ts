import { createContext } from "react";

export type RollerContext = {
  rollHistory: string[];
  userInfo: { id: string; name: string };
  panelData: Promise<{ formulas: string[] } | undefined>;
  storeRollResult: (result: string) => void;
};

export const RollerContext = createContext<RollerContext>({
  rollHistory: [],
  userInfo: { id: "", name: "" },
  panelData: new Promise((resolve) => resolve(undefined)),
  storeRollResult: () => {},
});
