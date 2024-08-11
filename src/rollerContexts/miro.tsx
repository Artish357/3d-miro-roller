import { Collection, UserInfo } from "@mirohq/websdk-types";
import { ReactNode, useEffect, useState } from "react";
import { RollerContext } from "../types/rollerContext";
import { RollHistory } from "../types/historicalRollResult";

export const MiroContextProvider = ({ children }: { children: ReactNode }) => {
  const rollHistoryStorage: Collection =
    miro.board.storage.collection("rollHistory");

  const [localRollHistory, setLocalRollHistory] = useState<RollHistory>([]);
  const [userInfo, setUserInfo] = useState<UserInfo | null>(null);

  let [remoteRollHistory, setRemoteRollHistory] = useState<RollHistory | null>(
    null
  );
  const mergedRollHistory = [...(remoteRollHistory ?? [])];
  for (const roll of localRollHistory) {
    if (!mergedRollHistory.find((rh) => rh.id === roll.id)) {
      mergedRollHistory.push(roll);
    }
  }
  mergedRollHistory.sort((a, b) => {
    return a.timestamp.localeCompare(b.timestamp);
  });

  const storeRollResult: RollerContext["storeRollResult"] = (result) => {
    if (result.type === "completed") {
      miro.board.events.broadcast(
        "roll-result",
        `${result.userName} rolls ${result.total}!`
      );
    }
    const newHistory = [
      ...mergedRollHistory.filter((rh) => rh.id !== result.id),
      result,
    ].slice(-100);
    setLocalRollHistory(newHistory);
    rollHistoryStorage.set("rollHistory", JSON.stringify(newHistory));
  };

  useEffect(() => {
    miro.board.getUserInfo().then((info) => {
      setUserInfo(info);
    });
    rollHistoryStorage.onValue<string>(
      "rollHistory",
      (newRollHistoryString) => {
        if (newRollHistoryString === undefined) {
          rollHistoryStorage.set("rollHistory", "[]");
        } else {
          setRemoteRollHistory(JSON.parse(newRollHistoryString));
        }
      }
    );
  }, []);

  const clearHistory = () => {
    rollHistoryStorage.set("rollHistory", "[]");
    setLocalRollHistory([]);
  };

  if (userInfo === null || remoteRollHistory === null) {
    return <div>Loading...</div>;
  }

  const context: RollerContext = {
    rollHistory: mergedRollHistory,
    userInfo,
    panelData: miro.board.ui.getPanelData(),
    storeRollResult,
  };
  return (
    <RollerContext.Provider value={context}>
      <button
        className="fw"
        style={{ margin: "5px 0" }}
        onClick={() => clearHistory()}
      >
        Clear history
      </button>
      {children}
    </RollerContext.Provider>
  );
};
