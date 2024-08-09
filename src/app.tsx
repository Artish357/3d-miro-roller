import { createRoot } from "react-dom/client";
import DiceBox, { RollResult } from "@3d-dice/dice-box";

import "../src/assets/style.css";
import * as React from "react";
import { useEffect, useState, FC } from "react";

function initiDiceBox(): Promise<DiceBox> {
  const diceBox = new DiceBox({
    container: "#dice-container",
    // Workaround for non-root deployments
    assetPath: document.location.pathname
      .split("/")
      .slice(0, -1)
      .concat(["assets/"])
      .join("/"),
    scale: 8,
  });

  return diceBox.init();
}

function rollResultToString({modifier, rolls, }: RollResult): string {
  const modifierString = modifier
          ? ` ${modifier > 0 ? "+" : "-"} ${Math.abs(modifier)} `
          : "";
return rolls.map((v) => String(v.value)).join(" + ") + modifierString;
}

const App: FC = () => {
  const [diceBox, setDiceBox] = useState<DiceBox | null>(null);
  const rollHistoryStorage = miro.board.storage.collection("rollHistory");
  const [localRollHistory, setLocaRollHistory] = useState<string[] | undefined>(
    undefined
  );
  const [user, setUser] = useState<Awaited<
    ReturnType<typeof miro.board.getUserInfo>
  > | null>(null);

  // Check if user requested a 2d6+MOD roll
  const rollMod = new URLSearchParams(window.location.search).get("roll-mod");

  useEffect(() => {
    miro.board.getUserInfo().then((u) => setUser(u));
    initiDiceBox().then((d: DiceBox) => {
      // Check if user requested a 2d6+MOD roll
      const rollModParsed = rollMod && parseInt(rollMod);
      if (rollMod != null && !Number.isNaN(rollModParsed)) {
        d.roll(`2d6+${rollModParsed}`);
      }
      setDiceBox(d);
    });

    rollHistoryStorage.onValue<string[]>("rollHistory", (rollHistory) => {
      if (rollHistory === undefined) {
        rollHistoryStorage.set("rollHistory", []);
      } else {
        setLocaRollHistory(rollHistory);
      }
    });
  }, []);

  if (diceBox) {
    diceBox.onRollComplete = (
      rollResults: {
        value: number;
        rolls: { value: number }[];
        mods: object[];
        modifier: number;
      }[]
    ) => {
      console.log("Roll Results", rollResults);
      let totalValue = 0;
      const rollStrings: string[] = [];
      for (const rr of rollResults) {
        rollStrings.push(rollResultToString(rr));
        totalValue += rr.value;
      }
      const valueResult = `${rollStrings.join(" + ")} = ${totalValue}`;
      miro.board.events.broadcast("roll-result", valueResult);
      const updatedHistory = [...(localRollHistory ?? []), valueResult].slice(
        -100
      );
      rollHistoryStorage.set("rollHistory", updatedHistory);
      setLocaRollHistory(updatedHistory);
    };
  }

  const rollHistoryElements = [];
  if (localRollHistory !== undefined) {
    for (let i = localRollHistory.length - 1; i >= 0; i--) {
      rollHistoryElements.push(
        <div
          className="fw"
          key={i}
          style={{ background: "#F3F3F3", borderRadius: 2, padding: 3 }}
        >
          {user?.name}: {localRollHistory[i]}
        </div>
      );
    }
  }
  return (
    <div
      className="fw fh flex flex-vertical dice-input-container"
      style={{ gap: "5px" }}
    >
      <div id="dice-input"></div>
      {localRollHistory?.map((r, i) => (
        <div
          className="fw"
          key={i}
          style={{ background: "#F3F3F3", borderRadius: 2, padding: 3 }}
        >
          {user?.name ?? "User"}: {r}
        </div>
      ))}
      <div
        id="dice-container"
        style={{
          position: "absolute",
          left: 3,
          right: 3,
          top: "50%",
          bottom: 3,
        }}
      ></div>
    </div>
  );
};

const container = document.getElementById("root");
if (container) {
  const root = createRoot(container);
  root.render(<App />);
}
