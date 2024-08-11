import { useState } from "react";
import { HistoricalRollResult } from "../types/historicalRollResult";

export type RollResultDisplayProps = {
  rollResult: HistoricalRollResult;
};

export const RollResultDisplay = ({ rollResult }: RollResultDisplayProps) => {
  const [expanded, setExpanded] = useState(false);

  const { userName, type, timestamp, originalFormula, description } =
    rollResult;

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
        <span dangerouslySetInnerHTML={{ __html: description ?? "" }}></span>
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
            {expanded && rollResult.result}
          </div>
        )}
      </div>
    </div>
  );
};
