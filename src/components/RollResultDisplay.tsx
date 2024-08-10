import { Fragment } from "react";
import { HistoricalRollResult } from "../types/historicalRollResult";
import { DieResultDisplay } from "./DieResultDisplay";

export type RollResultDisplayProps = {
  rollResult: HistoricalRollResult;
};

export const RollResultDisplay = ({
  rollResult: { userName, modifier, rolls, total, timestamp },
}: RollResultDisplayProps) => {
  const date = new Date(timestamp);
  return (
    <div
      className="fw roll-history-entry"
      style={{ background: "#F3F3F3", borderRadius: 2, padding: 3 }}
    >
      <div className="tooltip">
        {userName}
        <div className="tooltiptext">
          {date.toLocaleDateString()} {date.toLocaleTimeString()}
        </div>
      </div>
      {": "}
      {rolls.map((roll, i) => (
        <Fragment key={i}>
          {roll.map((dieResult, j) => (
            <Fragment key={j}>
              <DieResultDisplay dieResult={dieResult} />
              {j != roll.length - 1 && ","}
            </Fragment>
          ))}
          {i != rolls.length - 1 && " + "}
        </Fragment>
      ))}
      {modifier ? (modifier > 0 ? " + " : " - ") + Math.abs(modifier) : ""}
      {" = "}
      {total}
    </div>
  );
};
