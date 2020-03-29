import StateMachineJsonInterface from './StateMachineJsonInterface';
import validateField from '../validateField';
import State from '../state/State';
import StateMachineInterpreter from '../StateMachineInterpreter';
import compileJsonStateMachine from '../compileJsonStateMachine';
import JsonStateMachineCompilationInterface from '../JsonStateMachineCompilationInterface';


// TODO - allow this class to copy a chain of states to lock it in
export default class StateMachine {
  private version = '1.0';

  // this is the current default and the spec this is based on

  constructor(
    private startingState: State,
    private comment?: string,
    private timeoutSeconds?: number,
  ) {
    const timeoutSecondsUpperLimit = 99999999;
    if (timeoutSeconds !== undefined) {
      validateField(
        timeoutSeconds,
        {
          errorMessage: `TimeoutSeconds must be less than ${timeoutSecondsUpperLimit}`,
          test: (timeoutSecondsValue: number): boolean => (
            timeoutSecondsValue < timeoutSecondsUpperLimit
          ),
        },
        true,
      );
    }
  }

  getJsonObject = (): StateMachineJsonInterface => {
    const jsonObject: StateMachineJsonInterface = {
      StartAt: this.startingState.getName(),
      States: this.startingState.collectStatesJsonInformation({}),
      Version: this.version,
    };
    if (this.timeoutSeconds !== undefined) {
      jsonObject.TimeoutSeconds = this.timeoutSeconds;
    }
    if (this.comment !== undefined) {
      jsonObject.Comment = this.comment;
    }
    return jsonObject;
  };

  getSimulationOutputString = (): string => `State Machine
Comment: ${this.comment || ''}
Amazon States Language Version: ${this.version}
StartAt: ${this.startingState.getName()}
TimeoutSeconds: ${this.timeoutSeconds || 'N/A'}`;

  simulate = (input: Json): string => StateMachineInterpreter.simulateStateMachine(
    this.getSimulationOutputString(),
    this.startingState.getOutputGeneratorFunction(),
    input,
  );

  compile = (): JsonStateMachineCompilationInterface => compileJsonStateMachine(
    this.getJsonObject(),
  );
}
