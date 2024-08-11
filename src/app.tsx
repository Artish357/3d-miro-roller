import "../src/assets/style.css";
import { useEffect, useState, FC, useContext } from "react";
import { RollerContext } from "./types/rollerContext";
import { RollResultDisplay } from "./components/RollResultDisplay";
import { generateRandomId } from "./util/helpers";

const DiceBoxImport = import("@3d-dice/dice-box-threejs");
async function initDiceBox() {
  const DiceBox = (await DiceBoxImport).default;
  const diceBox = new DiceBox("#dice-container", {
    // Workaround for non-root deployments
    assetPath: document.location.pathname
      .split("/")
      .slice(0, -1)
      .concat(["assets/"])
      .join("/"),
    gravity_multiplier: 200,
    sounds: true,
    volume: 100,
    baseScale: 80,
    theme_colorset: "black",
  });
  await diceBox.initialize();
  return diceBox;
}

export const App: FC = () => {
  const [diceBox, setDiceBox] = useState<Awaited<
    ReturnType<typeof initDiceBox>
  > | null>(null);
  const {
    rollHistory,
    userInfo,
    panelData,
    storeRollResult,
    clearRollHistory,
  } = useContext(RollerContext);

  useEffect(() => {
    const diceBoxPromise = initDiceBox();
    panelData.then(async (data) => {
      for (const formula of data?.formulas ?? []) {
        await rollFormula(formula);
      }
    });
    diceBoxPromise.then((newDiceBox) => {
      setDiceBox(newDiceBox);
    });
  }, []);

  async function onInputSubmit(e: React.FormEvent<HTMLInputElement>) {
    e.preventDefault();
    const value = e.currentTarget.value;
    rollFormula(value);
  }

  const DiceRollImport = import("./lib/rpg-dice-roller");
  const rollFormula = async (formula: string) => {
    const { DiceRoll } = await DiceRollImport;
    const diceRoll = new DiceRoll(formula);
    const rollMeta = {
      id: generateRandomId(),
      originalFormula: diceRoll.notation,
      timestamp: new Date().toISOString(),
      type: "inProgress",
      userName: userInfo.name,
    } as const;
    const rollStrings = [];
    const resultStrings = [];
    for (const fullRoll of diceRoll.rolls) {
      if (typeof fullRoll === "number" || typeof fullRoll === "string") {
        continue;
      }
      if ("results" in fullRoll) {
        throw new Error("Roll groups not supported");
      }
      for (let i = 0; i < fullRoll.rolls.length; i++) {
        const roll = fullRoll.rolls[i];
        const rollString = `1d${roll.dice.sides}`;
        const resultString = `${roll.value}`;
        rollStrings.push(rollString);
        resultStrings.push(resultString);
      }
      storeRollResult(rollMeta);
    }
    await diceBox?.roll(`${rollStrings.join("+")}@${resultStrings.join(",")}`);
    storeRollResult({
      ...rollMeta,
      type: "completed",
      total: diceRoll.total,
      result: diceRoll.output.split(": ")[1],
    });
  };
  return (
    <div
      className="fw flex flex-vertical dice-input-container"
      style={{ gap: "5px" }}
    >
      <input
        type="text"
        className="roll-input"
        placeholder="2d20"
        onSubmit={onInputSubmit}
        onKeyDown={(e) => e.key == "Enter" && onInputSubmit(e)}
      />
      <button
        className="fw"
        style={{ maxWidth: 400, margin: "5px auto" }}
        onClick={() => clearRollHistory()}
      >
        Clear history
      </button>
      {rollHistory.map(({ id }, i) => {
        const r = rollHistory[rollHistory.length - 1 - i];
        return <RollResultDisplay key={id} rollResult={r} />;
      })}
      <div
        id="dice-container"
        style={{
          position: "absolute",
          left: 3,
          right: 3,
          top: "50%",
          bottom: 50,
          maxWidth: 800,
          margin: "0 auto",
        }}
      ></div>
    </div>
  );
};
