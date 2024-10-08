import { DieResult } from "../types/historicalRollResult";

export type DieResultDisplayProps = {
  dieResult: DieResult;
};
export const DieResultDisplay = ({ dieResult }: DieResultDisplayProps) => {
  return (
    <div className="tooltip">
      <span>{dieResult.value}</span>
      <div className="tooltiptext">d{dieResult.sides}</div>
    </div>
  );
};
