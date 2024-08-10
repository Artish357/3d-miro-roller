import DiceBox from "@3d-dice/dice-box";

import "../src/assets/style.css";
import { useEffect, useState, FC, useContext } from "react";
import { RollerContext } from "./types/rollerContext";
import { HistoricalRollResult } from "./types/historicalRollResult";
import { RollResultDisplay } from "./components/RollResultDisplay";

function initDiceBox(): Promise<DiceBox> {
  return new DiceBox({
    container: "#dice-container",
    // Workaround for non-root deployments
    assetPath: document.location.pathname
      .split("/")
      .slice(0, -1)
      .concat(["assets/"])
      .join("/"),
    scale: 8,
  }).init();
}

export const App: FC = () => {
  const [diceBox, setDiceBox] = useState<DiceBox | null>(null);
  const [lastFormula, setLastFormula] = useState<string>("");
  const { rollHistory, storeRollResult, userInfo, panelData } =
    useContext(RollerContext);

  useEffect(() => {
    const diceBoxPromise = initDiceBox();
    panelData.then(async (data) => {
      for (const formula of data?.formulas ?? []) {
        setLastFormula(formula);
        await (await diceBoxPromise).roll(formula);
      }
    });
    diceBoxPromise.then((newDiceBox) => {
      setDiceBox(newDiceBox);
    });
  }, []);

  if (diceBox) {
    diceBox.onRollComplete = (rollResults) => {
      console.log("Roll Results", rollResults);
      const valueResult: HistoricalRollResult = {
        modifier: rollResults.reduce((acc, r) => acc + r.modifier, 0),
        rolls: rollResults.map(({ rolls }) =>
          rolls.map((roll) => ({
            value: roll.value,
            sides: roll.sides,
          }))
        ),
        timestamp: new Date().toISOString(),
        userName: userInfo.name,
        originalFormula: lastFormula,
        total: rollResults.reduce((acc, r) => acc + r.value, 0),
      };
      storeRollResult(valueResult);
    };
  }

  function onInputSubmit(e: React.FormEvent<HTMLInputElement>) {
    e.preventDefault();
    const value = e.currentTarget.value.replaceAll(" ", "");
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
    setLastFormula(diceRolls.join("+"));
    diceBox?.roll(diceRolls);
  }
  return (
    <div
      className="fw fh flex flex-vertical dice-input-container"
      style={{ gap: "15px" }}
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
        return <RollResultDisplay key={i} rollResult={r} />;
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
