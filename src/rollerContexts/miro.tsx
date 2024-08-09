import { Collection, UserInfo } from "@mirohq/websdk-types";
import { ReactNode, useEffect, useState } from "react";
import * as React from "react";
import { RollerContext } from "./rollerContext";

export const MiroContextProvider = ({children}: {children: ReactNode}) => {
  const [rollHistory, setRollHistory] = useState<string[]>([])
  const [userInfo, setUserInfo] = useState<UserInfo>({ id: "", name: "" });
  const rollHistoryStorage: Collection =
    miro.board.storage.collection("rollHistory");

  const storeRollResult: RollerContext['storeRollResult'] = (result: string) => {
    miro.board.events.broadcast("roll-result", result);
    setRollHistory((prev) => [...prev, result].slice(-100));
  }

  useEffect(() => {
    miro.board.getUserInfo().then((u) => setUserInfo(u));
    rollHistoryStorage.onValue<string[]>("rollHistory", (rollHistory) => {
      if (rollHistory === undefined) {
        rollHistoryStorage.set("rollHistory", []);
      } else {
        setRollHistory(rollHistory);
      }
    });
  }, [])

  const context: RollerContext = {
    rollHistory,
    userInfo,
    storeRollResult
  }
  return <RollerContext.Provider value={context}>{children}</RollerContext.Provider>
}