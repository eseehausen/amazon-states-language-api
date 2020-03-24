import StateJsonObjectInterface from './StateJsonInterface';

export default abstract class State {
  protected constructor(
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

  getBaseJsonObject = (includeNextAndEnd: boolean): StateJsonObjectInterface => {
    const baseJsonObject: StateJsonObjectInterface = {
      Type: this.type,
    };

    // null would work here, but we already need to omit totally invalid fields, so keep it "clean"
    if (this.comment !== undefined) {
      baseJsonObject.Comment = this.comment;
    }

    if (includeNextAndEnd) {
      if (this.next !== undefined) {
        baseJsonObject.Next = this.next.getName();
      }
      baseJsonObject.End = this.isEndState();
    }

    return baseJsonObject;
  };

  abstract getJsonObject (): StateJsonObjectInterface;

  getName = (): string => this.name;

  setNextState = (nextState: State): State => { // return State for chaining
    this.next = nextState;
    return this;
  };

  appendState = (appendedState: State): State => { // return appendedState for chaining
    this.setNextState(appendedState);
    return appendedState;
  };

  abstract getNextState(): State|undefined;

  // may want to just flip to a default in the constructor, since most states can,
  // and it's not clear that we need to do any processing here
  protected abstract canHaveNextState(): boolean;

  abstract isEndState(): boolean;

  protected getSimulationOutput(input?: Json): SimulationOutputInterface {
    return {
      string: this.getSimulationOutputString(input),
      jsonObject: this.getSimulationOutputJsonObject(input),
    };
  }

  protected getSimulationOutputString(input?: Json): string {
    const labelModifier = this.isEndState() ? 'Final' : 'Current';
    const commentString: string = this.comment !== undefined ? `\nComment: ${this.comment}` : '';
    return `${labelModifier} state: ${this.getName() + commentString}

Input:
${JSON.stringify(input)}

Output:
${JSON.stringify(this.getSimulationOutputJsonObject(input))}
`; // if this doesn't end up being overridden, it should move into the output interface
  }

  protected abstract getSimulationOutputJsonObject(input?: Json): Json;

  getOutputGeneratorFunction(): StateOutputGeneratorFunction {
    return (function* stateOutputGenerator(state: State, input: Json):
      Generator<SimulationOutputInterface> {
      const output = state.getSimulationOutput(input);
      yield output;
      if (!state.isEndState()) {
        yield* stateOutputGenerator(state.getNextState(), output.jsonObject);
      }
    }).bind(this, this);
  }
}
