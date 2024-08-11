declare module "@3d-dice/dice-box-threejs" {
  export type RollResult = {
    modifier: number;
    notation: string;
    sets: {
      num: number;
      sides: number;
      total: number;
      type: string;
      rolls: {
        id: number;
        label: string;
        reason: string;
        sides: number;
        type: string;
        value: number;
      }[];
    }[];
    total: number;
  };
  export default class DiceBox {
    constructor(selector: string, options: unknown);
    roll(input: unknown): Promise<unknown>;
    initialize(): Promise<unknown>;
    public onRollComplete: (result: RollResult) => void;
  }
}
