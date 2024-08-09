declare module "@3d-dice/dice-box" {
  export default class DiceBox {
    constructor(options: unknown);
    roll(input: string): void;
    init(): Promise<DiceBox>;
    public onRollComplete: (result: { value: number; rolls: { value: number }[]; mods: object[]; modifier: number}[]) => void;
  }
}