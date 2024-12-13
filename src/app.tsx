import "../src/assets/style.css";
import { useEffect, useState, FC, useContext } from "react";
import { RollerContext } from "./types/rollerContext";
import { RollResultDisplay } from "./components/RollResultDisplay";
import { generateRandomId } from "./util/helpers";
import DiceBox from "@3d-dice/dice-box-threejs";

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
    gravity_multiplier: 400,
    sounds: true,
    volume: 100,
    baseScale: 65,
    strength: 8,
    theme_customColorset: { background: ["#00ffcb"] },
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
    diceBoxPromise.then((newDiceBox) => {
      panelData.then(async (data) => {
        const { formulas, description } = data ?? {};
        for (const formula of formulas ?? []) {
          await rollFormula(formula, newDiceBox, description);
        }
      });
      setDiceBox(newDiceBox);
    });

    try {
      miro.board.events.on("simulateRoll", async (formula) => {
        (await diceBoxPromise).roll(formula);
      });
    } catch (e) {
      void e;
    }
  }, []);

  async function onInputSubmit(e: React.FormEvent<HTMLInputElement>) {
    e.preventDefault();
    const value = e.currentTarget.value;
    if (!diceBox) {
      return;
    }
    rollFormula(value, diceBox);
  }

  const DiceRollImport = import("./lib/rpg-dice-roller");
  const rollFormula = async (
    formula: string,
    usingDiceBox: DiceBox,
    description?: string
  ) => {
    const rollMeta = {
      id: generateRandomId(),
      originalFormula: formula,
      timestamp: new Date().toISOString(),
      type: "inProgress",
      userName: userInfo.name,
      description,
    } as const;
    storeRollResult(rollMeta);
    const { DiceRoll } = await DiceRollImport;
    const diceRoll = new DiceRoll(formula);
    const rollStrings = [];
    const resultStrings = [];
    const supportedDice = ["F.1", "F.2", "F", 2, 3, 4, 6, 8, 10, 12, 20, 100];
    for (const fullRoll of diceRoll.rolls) {
      if (typeof fullRoll === "number" || typeof fullRoll === "string") {
        continue;
      }
      if ("results" in fullRoll) {
        throw new Error("Roll groups not supported");
      }
      for (let i = 0; i < fullRoll.rolls.length; i++) {
        const roll = fullRoll.rolls[i];
        let sides = roll.dice.sides;
        if (!supportedDice.includes(sides)) {
          continue;
        }
        if (sides === "F.1" || sides === "F.2" || sides === "F") {
          sides = "f"; // 3d-dice-box uses "f" for fudge dice
        }
        const rollString = `1d${sides}`;
        const resultString = `${roll.value}`;
        rollStrings.push(rollString);
        resultStrings.push(resultString);
      }
    }
    if (rollStrings.length !== 0) {
      const loadedFormula = `${rollStrings.join("+")}@${resultStrings.join(",")}`;
      try {
        miro.board.events.broadcast("simulateRoll", loadedFormula);
      } catch (e) {
        void e;
      }
      await usingDiceBox.roll(loadedFormula);
    }
    storeRollResult({
      ...rollMeta,
      originalFormula: diceRoll.notation,
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
      {[...rollHistory].reverse().map((r) => {
        return <RollResultDisplay key={r.id} rollResult={r} />;
      })}
      <div
        id="dice-container"
        style={{
          position: "absolute",
          left: 3,
          right: 3,
          top: "50%",
          bottom: 50,
        }}
      ></div>
    </div>
  );
};
