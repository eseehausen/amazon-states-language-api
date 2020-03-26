import StateJsonObjectInterface from './StateJsonInterface';
import validateField from '../validateField';
import StateJsonInformationInterface from './StateJsonInformationInterface';

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

  protected getSimulationOutput(input?: Json): SimulationOutputInterface {
    return {
      input,
      output: this.getSimulationOutputJsonObject(input),
      stateJsonObject: this.getJsonObject(),
    };
  }

  protected abstract getSimulationOutputJsonObject(input?: Json): Json;

  getOutputGeneratorFunction(): StateOutputGeneratorFunction {
    return (function* stateOutputGenerator(state: State, input: Json):
      Generator<SimulationOutputInterface> {
      const output = state.getSimulationOutput(input);
      yield output;
      if (!state.isEndState()) {
        yield* stateOutputGenerator(state.getNextState(), output.output);
      }
    }).bind(this, this);
  }

  protected getNextState = (): State|null => null;

  getStateJsonInformationGeneratorFunction = (): () => Generator<StateJsonInformationInterface> => (
    function* pathGenerator(state: State): Generator<StateJsonInformationInterface> {
      yield {
        name: state.getName(),
        jsonObject: state.getJsonObject(),
      };
      const nextState = state.getNextState();
      if (nextState instanceof State) {
        yield* pathGenerator(nextState);
      }
    }.bind(this, this)
  );

  getSimulatedOutput(input: Json): SimulationOutputInterface { // useful for testing
    return this.getOutputGeneratorFunction()(input).next().value;
  }
}
