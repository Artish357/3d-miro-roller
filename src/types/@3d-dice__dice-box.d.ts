/* eslint-disable no-unused-vars */
declare module "@3d-dice/dice-box" {
  export type RollResult = {
    value: number;
    rolls: { value: number }[];
    mods: object[];
    modifier: number;
  };
  export default class DiceBox {
    constructor(options: unknown);
    roll(input: string | string[]): void;
    init(): Promise<DiceBox>;
    public onRollComplete: (result: RollResult[]) => void;
  }
}
