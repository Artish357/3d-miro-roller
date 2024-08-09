import * as React from "react";
import { createRoot } from "react-dom/client";
import DiceBox from "@3d-dice/dice-box";
import { AdvancedRoller } from "@3d-dice/dice-ui";

import "../src/assets/style.css";
import { useEffect } from "react";

const App: React.FC = () => {
  const [diceBox, setDiceBox] = React.useState<DiceBox | null>(null);
  const [roller, setRoller] = React.useState<AdvancedRoller | null>(null);
  const rollHistoryStorage = miro.board.storage.collection("rollHistory");
  const [rollHistory, setRollHistory] = React.useState<string[] | undefined>(
    undefined
  );
  const [user, setUser] = React.useState<Awaited<
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
      console.log("setting roll history", rollHistory);
      if (rollHistory === undefined) {
        rollHistoryStorage.set("rollHistory", []);
      } else {
        setRollHistory([...rollHistory]);
      }
    });

    rollHistoryStorage.get<string[]>("rollHistory").then((rollHistory) => {
      console.log('got roll history', rollHistory);
      setRollHistory(rollHistory);
    })

    diceBox.init().then((d: DiceBox) => {
      const rollModParsed = rollMod && parseInt(rollMod);
      console.log("rollMod", rollMod, rollModParsed);
      if (rollMod != null && !Number.isNaN(rollModParsed)) {
        d.roll(`2d6+${rollModParsed}`);
      }
    });
    setDiceBox(diceBox);
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
      const valueResults = result.map(({ value, rolls, modifier }) => {
        const modifierString = modifier
          ? ` ${modifier > 0 ? "+" : "-"} ${Math.abs(modifier)} `
          : "";
        return `${rolls
          .map((v) => String(v.value))
          .join(" + ")}${modifierString} = ${String(value)}`;
      });
      const newValue = [...(rollHistory ?? []), ...valueResults].slice(-100);
      console.log("newValue", newValue);
      rollHistoryStorage.set("rollHistory", newValue);
      setRollHistory(newValue);
    };
  }

  const rollHistoryElements = [];
  if (rollHistory !== undefined) {
    for (let i = rollHistory.length - 1; i >= 0; i--) {
      rollHistoryElements.push(
        <div
          className="fw"
          key={i}
          style={{ background: "#F3F3F3", borderRadius: 2, padding: 3 }}
        >
          {user?.name}: {rollHistory[i]}
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
const root = createRoot(container);
root.render(<App />);
