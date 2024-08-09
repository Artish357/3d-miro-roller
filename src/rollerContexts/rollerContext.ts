import { createContext } from "react";

export type RollerContext = {
  rollHistory: string[];
  storeRollResult: (result: string) => void;
  userInfo: { id: string; name: string };
};

export const RollerContext = createContext<RollerContext>({
  rollHistory: [],
  userInfo: { id: "", name: "" },
  storeRollResult: () => {},
});
