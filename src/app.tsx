import { createRoot } from "react-dom/client";
import DiceBox from "@3d-dice/dice-box";
import { AdvancedRoller } from "@3d-dice/dice-ui";

import "../src/assets/style.css";
import * as React from "react";
import { useEffect, useState, FC } from "react";

const App: FC = () => {
  const [diceBox, setDiceBox] = useState<DiceBox | null>(null);
  const [_roller, setRoller] = useState<AdvancedRoller | null>(null);
  const rollHistoryStorage = miro.board.storage.collection("rollHistory");
  const [lolalRollHistory, setLocaRollHistory] = useState<string[] | undefined>(
    undefined
  );
  const [user, setUser] = useState<Awaited<
    ReturnType<typeof miro.board.getUserInfo>
  > | null>(null);
  const rollMod = new URLSearchParams(window.location.search).get("roll-mod");
  useEffect(() => {
    miro.board.getUserInfo().then((u) => setUser(u));
    miro.board.ui.on("custom:roll-with-mod", (text) => {
      diceBox.roll(`2d6+${text}`);
    });
    const diceBox = new DiceBox({
      container: "#dice-container",
      assetPath: "/dice-box/",
      scale: 8,
    });

    setRoller(
      new AdvancedRoller({
        target: ".dice-input-container",
        onSubmit(input: string) {
          console.log("input", input);
          diceBox.roll(input);
        },
      })
    );

    rollHistoryStorage.onValue<string[]>("rollHistory", (rollHistory) => {
      if (rollHistory === undefined) {
        rollHistoryStorage.set("rollHistory", []);
      } else {
        setLocaRollHistory(rollHistory);
      }
    });

    diceBox.init().then((d: DiceBox) => {
      const rollModParsed = rollMod && parseInt(rollMod);
      console.log("rollMod", rollMod, rollModParsed);
      if (rollMod != null && !Number.isNaN(rollModParsed)) {
        d.roll(`2d6+${rollModParsed}`);
      }
      setDiceBox(d);
    });
  }, []);

  if (diceBox) {
    diceBox.onRollComplete = (
      result: {
        value: number;
        rolls: { value: number }[];
        mods: object[];
        modifier: number;
      }[]
    ) => {
      console.log("result", result);
      let totalValue = 0;
      const valueResults = result.map(
        ({ value: rollValue, rolls, modifier }) => {
          const modifierString = modifier
            ? ` ${modifier > 0 ? "+" : "-"} ${Math.abs(modifier)} `
            : "";
          totalValue += rollValue;
          return rolls.map((v) => String(v.value)).join(" + ") + modifierString;
        }
      );
      const valueResult: string = `${valueResults.join(" + ")} = ${String(totalValue)}`;
      const updatedHistory = [...(lolalRollHistory ?? []), valueResult].slice(
        -100
      );
      rollHistoryStorage.set("rollHistory", updatedHistory);
      setLocaRollHistory(updatedHistory);
    };
  }

  const rollHistoryElements = [];
  if (lolalRollHistory !== undefined) {
    for (let i = lolalRollHistory.length - 1; i >= 0; i--) {
      rollHistoryElements.push(
        <div
          className="fw"
          key={i}
          style={{ background: "#F3F3F3", borderRadius: 2, padding: 3 }}
        >
          {user?.name}: {lolalRollHistory[i]}
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
      {rollHistoryElements}
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
