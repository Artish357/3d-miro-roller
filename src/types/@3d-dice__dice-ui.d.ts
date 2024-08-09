declare module "@3d-dice/dice-ui" {
  export class AdvancedRoller {
    constructor(options: { target: string; onSubmit: (input: string) => void });
  }
}