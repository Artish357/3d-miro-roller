import { Fragment, useState } from "react";
import {
  CompletedRoll,
  HistoricalRollResult,
} from "../types/historicalRollResult";
import { DieResultDisplay } from "./DieResultDisplay";

export type RollResultDisplayProps = {
  rollResult: HistoricalRollResult;
};

export const RollResultDisplay = ({ rollResult }: RollResultDisplayProps) => {
  const [expanded, setExpanded] = useState(false);

  const { userName, type, timestamp, originalFormula } = rollResult;

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
        {type === "inProgress" && (
          <div className="well">
            <i>Rolling...</i>
          </div>
        )}
        {type === "completed" && (
          <div
            className="well"
            style={{ cursor: "pointer" }}
            onClick={() => setExpanded(!expanded)}
          >
            {!expanded && <b>{rollResult.total}</b>}
            {expanded && ExpandedResult(rollResult)}
          </div>
        )}
      </div>
    </div>
  );
};

const ExpandedResult = ({ rolls, total, modifier, id }: CompletedRoll) => {
  return (
    <>
      {rolls.map((roll, i) => (
        <Fragment key={id}>
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
    </>
  );
};
