import StateJsonObjectInterface from './StateJsonInterface';
import validateField, { ValidationResultInterface } from '../validateField';
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

      const reducedStatesJsonInformation = possibleNextStates.reduce(
        // runs against all possible next states to capture branches
        (nextStatesJsonInformation: StatesJsonInterface, possibleNextState: State|null) => ({
          ...nextStatesJsonInformation,
          ...(possibleNextState !== null
            ? possibleNextState.collectStatesJsonInformation(currentStatesJsonInformation)
            : {}
          ),
        }),
        {},
      );

      return {
        ...currentStatesJsonInformation,
        ...reducedStatesJsonInformation,
      };
    }
    return statesJsonInformation;
  }

  getSimulatedOutput(input: Json): SimulationOutputInterface { // useful for testing
    return this.getOutputGeneratorFunction()(input).next().value;
  }

  static tracePath = (input: Json, variablePath: string): Json => (
    (function regexTracePath(
      fieldRegex: RegExp, traceInput: Json, traceVariablePath: string,
    ): Json {
      // naive implementation - replace with library
      const match = fieldRegex.exec(traceVariablePath);
      const matchFound = match !== null;

      if (matchFound && !Object.prototype.hasOwnProperty.call(traceInput, match[1])) {
        throw new Error(`Invalid match ${match[1]} in ReferencePath.`);
      }

      return matchFound
        ? regexTracePath(fieldRegex, traceInput[match[1]], traceVariablePath) : traceInput;
    }(new RegExp(/(?:\.([A-Za-z0-9_-]+))/g), input, variablePath))
  );

  static validateReferencePath = (referencePath: string, throwErrorOnFailure: boolean):
    ValidationResultInterface => validateField(
    referencePath,
    {
      errorMessage: `VariablePath ${referencePath} is not in ReferencePath format.`,
      test: (variablePathValue: string) => /\$(\.([A-Za-z0-9_-]+))*/.test(variablePathValue),
    },
    throwErrorOnFailure,
  );
}
