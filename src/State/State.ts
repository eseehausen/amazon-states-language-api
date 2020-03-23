import StateJsonObjectInterface from './StateJsonInterface';

export default abstract class State {
  constructor(
    protected readonly type: string,
    protected readonly name: string,
    protected readonly comment?: string,
    protected next?: State,
  ) {
    if (name.length > 128) {
      throw new Error(`State name cannot exceed 128 characters. Clashing name: ${this.name}`); // TODO TEST
    }

    if (next !== undefined && !this.canHaveNextState()) {
      throw new Error(
        `State cannot take a next state.
Clashing state: ${this.name} Attempted next state: ${next.name}`,
      );
    }
  }

  getBaseJsonObject = (): StateJsonObjectInterface => {
    const baseJsonObject: StateJsonObjectInterface = {
      Type: this.type,
    };
    if (this.comment !== undefined) {
      baseJsonObject.Comment = this.comment;
    }
    return baseJsonObject;
  };

  abstract getJsonObject (): StateJsonObjectInterface;

  getName = (): string => this.name;

  setNextState = (nextState: State): State => { // return State for chaining
    this.next = nextState;
    return this;
  };

  appendState = (appendedState: State): State => { // return State for chaining
    this.setNextState(appendedState);
    return appendedState;
  };

  abstract getNextState(): State|undefined;

  protected abstract canHaveNextState(): boolean;

  abstract isEndState(): boolean;

  getSimulationOutput(): string {
    const labelModifier = this.isEndState() ? 'Final' : 'Current';
    return `${labelModifier} state: ${this.getName()}\n`;
  }
}
