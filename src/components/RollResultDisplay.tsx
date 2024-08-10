import { HistoricalRollResult } from "../types/historicalRollResult";
import { DieResultDisplay } from "./DieResultDisplay";

export type RollResultDisplayProps = {
  rollResult: HistoricalRollResult;
};

export const RollResultDisplay = ({
  rollResult: { userName, modifier, rolls, total, timestamp, originalFormula },
}: RollResultDisplayProps) => {
  const date = new Date(timestamp);
  let dateString = date.toLocaleDateString();
  const todayDateString = new Date().toLocaleDateString();
  if (dateString === todayDateString) {
    dateString = "";
  }
  const timeString = date.toLocaleTimeString();

  return (
    <div
      className="fw roll-history-entry"
      style={{ background: "#F3F3F3", borderRadius: 5, padding: "10px 15px" }}
    >
      <div
        className="fw flex flex-space-between flex-v-center"
        style={{ marginBottom: "5px" }}
      >
        <span>{userName}</span>
        <span style={{ fontSize: "0.75rem" }}>
          {dateString} {timeString}
        </span>
      </div>
      <div
        className="flex fw flex-vertical"
        style={{ gap: "5px", textAlign: "center" }}
      >
        <div className="well">{originalFormula}</div>
        <div className="well">{total}</div>
      </div>
      {/* {rolls.map((roll, i) => (
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
      {total} */}
    </div>
  );
};
