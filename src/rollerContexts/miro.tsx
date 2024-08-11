import { Collection } from "@mirohq/websdk-types";
import { ReactNode, useEffect, useState } from "react";
import { RollerContext } from "../types/rollerContext";
import { HistoricalRollResult } from "../types/historicalRollResult";

const rollHistoryStorage: Collection =
  miro.board.storage.collection("rollHistory");
const initialRollHistory = JSON.parse(
  (await rollHistoryStorage.get<string>("rollHistory")) || "[]"
) as HistoricalRollResult[];
const userInfo = await miro.board.getUserInfo();

export const MiroContextProvider = ({ children }: { children: ReactNode }) => {
  const [localRollHistory, setLocalRollHistory] = useState<
    HistoricalRollResult[]
  >([]);
  const [remoteRollHistory, setRemoteRollHistory] =
    useState<HistoricalRollResult[]>(initialRollHistory);
  const mergedRollHistory = [...remoteRollHistory];
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
    const newLocalHistory = [
      ...localRollHistory.filter((rh) => rh.id !== result.id),
      result,
    ].slice(-100);
    setLocalRollHistory(newLocalHistory);

    const newRemoteHistory = [
      ...remoteRollHistory.filter((rh) => rh.id !== result.id),
      result,
    ].slice(-100);
    rollHistoryStorage.set("rollHistory", JSON.stringify(newRemoteHistory));
  };

  useEffect(() => {
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
