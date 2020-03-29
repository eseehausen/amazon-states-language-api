import StateJsonObjectInterface from './StateJsonInterface';
import validateField from '../validateField';
import StatesJsonInterface from '../stateMachine/StatesJsonInterface';

export default abstract class State {
  protected constructor(
    protected readonly type: string,
    protected readonly name: string,
    protected readonly comment?: string,
  ) {
    validateField(
      name,
      {
        errorMessage: `State name cannot exceed 128 characters. Clashing name: ${name}`,
        test: (nameValue) => nameValue.length <= 128,
      },
      true,
    );
  }

  protected getJsonObject(): StateJsonObjectInterface {
    const baseJsonObject: StateJsonObjectInterface = {
      Type: this.type,
    };

    // null would work here, but we already need to omit totally invalid fields, so keep it "clean"
    if (this.comment !== undefined) {
      baseJsonObject.Comment = this.comment;
    }

    if (this.isEndState()) {
      baseJsonObject.End = true;
    }

    return baseJsonObject;
  }

  getName = (): string => this.name;
  // needed for StartAt JSON assignment for now

  protected abstract isEndState(): boolean;

  protected getSimulationOutput = (input?: Json): SimulationOutputInterface => ({
    input,
    output: this.getSimulationOutputJsonObject(input),
    stateJsonObject: {
      ...{ Name: this.getName() },
      ...this.getJsonObject(),
    },
  });

  protected abstract getSimulationOutputJsonObject(input?: Json): Json;

  getOutputGeneratorFunction(): StateOutputGeneratorFunction {
    let count = 0;
    const maxCount = 1000;
    return (function* stateOutputGenerator(state: State, input: Json):
      Generator<SimulationOutputInterface> {
      count += 1;
      if (count > 1000) {
        throw new Error(`Maximum count (${maxCount}) exceeded.`);
      }

      const output = state.getSimulationOutput(input);
      yield output;

      if (!state.isEndState()) {
        yield* stateOutputGenerator(state.getNextState(output.output), output.output);
      }
    }).bind(this, this);
  }

  // we use this in ChoiceState
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  protected getNextState = (input: Json = {}): State | null => null;

  protected getPossibleNextStates(): (State|null)[] {
    return [this.getNextState()];
  }

  collectStatesJsonInformation(
    statesJsonInformation: StatesJsonInterface,
  ): StatesJsonInterface {
    const stateName = this.getName();

    if (!Object.prototype.hasOwnProperty.call(statesJsonInformation, stateName)) {
      const currentStatesJsonInformation = {
        ...statesJsonInformation,
        [stateName]: this.getJsonObject(),
      };

      const possibleNextStates = this.getPossibleNextStates();

      if (possibleNextStates.length > 0) {
        return {
          ...currentStatesJsonInformation,
          ...possibleNextStates.reduce( // runs against all possible next states to capture branches
            (nextStatesJsonInformation: StatesJsonInterface, possibleNextState: State|null) => ({
              ...nextStatesJsonInformation,
              ...(possibleNextState !== null
                ? possibleNextState.collectStatesJsonInformation(currentStatesJsonInformation)
                : {}
              ),
            }),
            {},
          ),
        };
      }
      return currentStatesJsonInformation;
    }
    return statesJsonInformation;
  }

  getSimulatedOutput(input: Json): SimulationOutputInterface { // useful for testing
    return this.getOutputGeneratorFunction()(input).next().value;
  }
}
