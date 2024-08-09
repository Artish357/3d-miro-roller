import { useState } from "react";
import * as React from "react";
import { RollerContext } from "./rollerContext";

export const LocalContextProvider = ({children}: {children: React.ReactNode}) => {
  const [rollHistory, setRollHistory] = useState<string[]>([])
  const userInfo = { id: "User", name: "User" };

  const storeRollResult: RollerContext['storeRollResult'] = (result: string) => {
    setRollHistory((prev) => [...prev, result].slice(-100));
  }

  const context: RollerContext = {
    rollHistory,
    userInfo,
    storeRollResult
  }
  return <RollerContext.Provider value={context}>{children}</RollerContext.Provider>
}
