import { useState } from "react";
import * as React from "react";
import { RollerContext } from "../types/rollerContext";
import {
  HistoricalRollResult,
  RollHistory,
} from "../types/historicalRollResult";

export const LocalContextProvider = ({
  children,
}: {
  children: React.ReactNode;
}) => {
  const [rollHistory, setRollHistory] = useState<RollHistory>([]);
  const userInfo = { id: "User", name: "User" };

  const storeRollResult: RollerContext["storeRollResult"] = (
    result: HistoricalRollResult
  ) => {
    setRollHistory((prev) =>
      [...prev.filter((rhEntry) => rhEntry.id !== result.id), result].slice(
        -100
      )
    );
  };

  const context: RollerContext = {
    rollHistory,
    userInfo,
    panelData: new Promise((resolve) => resolve(undefined)),
    storeRollResult,
    clearRollHistory: () => setRollHistory([]),
  };
  return (
    <RollerContext.Provider value={context}>{children}</RollerContext.Provider>
  );
};
