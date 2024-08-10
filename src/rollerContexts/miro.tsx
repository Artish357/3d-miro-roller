import { Collection, UserInfo } from "@mirohq/websdk-types";
import { ReactNode, useEffect, useState } from "react";
import { RollerContext } from "../types/rollerContext";
import { HistoricalRollResult } from "../types/historicalRollResult";

export const MiroContextProvider = ({ children }: { children: ReactNode }) => {
  const [rollHistory, setRollHistory] = useState<HistoricalRollResult[]>([]);
  const [userInfo, setUserInfo] = useState<UserInfo>({ id: "", name: "" });
  const rollHistoryStorage: Collection =
    miro.board.storage.collection("rollHistory");

  const storeRollResult: RollerContext["storeRollResult"] = (result) => {
    miro.board.events.broadcast(
      "roll-result",
      `${result.userName} rolls ${result.total}!`
    );
    const newHistory = [...rollHistory, result];
    rollHistoryStorage.set("rollHistory", JSON.stringify(newHistory));
    setRollHistory(newHistory.slice(-100));
  };

  useEffect(() => {
    miro.board.getUserInfo().then((u) => setUserInfo(u));
    rollHistoryStorage.onValue<string>("rollHistory", (rollHistory) => {
      if (rollHistory === undefined) {
        rollHistoryStorage.set("rollHistory", []);
      } else {
        setRollHistory(JSON.parse(rollHistory) as HistoricalRollResult[]);
      }
    });
  }, []);

  const context: RollerContext = {
    rollHistory,
    userInfo,
    panelData: miro.board.ui.getPanelData(),
    storeRollResult,
  };
  return (
    <RollerContext.Provider value={context}>{children}</RollerContext.Provider>
  );
};
