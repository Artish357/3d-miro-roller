import DiceBox, { RollResult } from "@3d-dice/dice-box";

import "../src/assets/style.css";
import * as React from "react";
import { useEffect, useState, FC, useContext } from "react";
import { RollerContext } from "./rollerContexts/rollerContext";

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

function rollResultToString({ modifier, rolls }: RollResult): string {
  const modifierString = modifier
    ? ` ${modifier > 0 ? "+" : "-"} ${Math.abs(modifier)} `
    : "";
  return rolls.map((v) => String(v.value)).join(",") + modifierString;
}

export const App: FC = () => {
  const [diceBox, setDiceBox] = useState<DiceBox | null>(null);
  const { rollHistory, storeRollResult, userInfo } = useContext(RollerContext);

  // Check if user requested a 2d6+MOD roll
  const rollMod = new URLSearchParams(window.location.search).get("roll-mod");

  useEffect(() => {
    initiDiceBox().then((d: DiceBox) => {
      // Check if user requested a 2d6+MOD roll
      const rollModParsed = rollMod && parseInt(rollMod);
      if (rollMod != null && !Number.isNaN(rollModParsed)) {
        d.roll(`2d6+${rollModParsed}`);
      }
      setDiceBox(d);
    });
  }, []);

  if (diceBox) {
    diceBox.onRollComplete = (
      rollResults: {
        value: number;
        rolls: { value: number }[];
        mods: object[];
        modifier: number;
      }[],
    ) => {
      console.log("Roll Results", rollResults);
      let totalValue = 0;
      const rollStrings: string[] = [];
      for (const rr of rollResults) {
        rollStrings.push(rollResultToString(rr));
        totalValue += rr.value;
      }
      const valueResult = `${rollStrings.join(" + ")} = ${totalValue}`;
      storeRollResult(valueResult);
    };
  }

  function onInputSubmit(e: React.FormEvent<HTMLInputElement>) {
    e.preventDefault();
    const value = e.currentTarget.value;
    const rolls: string[] = [""];
    for (const char of value) {
      if (char === "+" || char === "-") {
        rolls.push(char);
      } else {
        rolls[rolls.length - 1] = (rolls[rolls.length - 1] ?? "") + char;
      }
    }
    const diceRolls = [];
    let combinedModifiers = 0;
    for (const roll of rolls) {
      const isModifier = /^(\+|-)(\d+)$/;
      if (isModifier.test(roll)) {
        const [_, modifierSign, modifierValue] = roll.match(isModifier) ?? [];
        combinedModifiers += parseInt(modifierSign + modifierValue);
      } else {
        diceRolls.push(roll.replaceAll("+", "").replaceAll("-", ""));
      }
    }
    let signedModifier = "";
    if (combinedModifiers > 0) {
      signedModifier = `+${combinedModifiers}`;
    } else if (combinedModifiers < 0) {
      signedModifier = `-${combinedModifiers}`;
    }
    diceRolls[diceRolls.length - 1] += signedModifier;
    diceBox?.roll(diceRolls);
  }
  return (
    <div
      className="fw fh flex flex-vertical dice-input-container"
      style={{ gap: "5px" }}
    >
      <input
        type="text"
        className="roll-input"
        placeholder="2d20"
        onSubmit={onInputSubmit}
        onKeyDown={(e) => e.key == "Enter" && onInputSubmit(e)}
      />
      {rollHistory.map((_, i) => {
        const r = rollHistory[rollHistory.length - 1 - i];
        return (
          <div
            className="fw roll-history-entry"
            key={i}
            style={{ background: "#F3F3F3", borderRadius: 2, padding: 3 }}
          >
            {userInfo.name}: {r}
          </div>
        );
      })}
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
