import State from '../state/State';
import StateMachineJsonInterface from './StateMachineJsonInterface';
import StatesJsonInterface from './StatesJsonInterface';


// TODO - allow this class to copy a chain of states to lock it in
export default class StateMachine {
  private version = '1.0';
  // this is the current default and the spec this is based on

  constructor(
    private startingState: State,
    private comment?: string,
    private timeoutSeconds?: number,
  ) { }

  collectStatesJsonObject = (
    baseStatesJsonObject: StatesJsonInterface, state: State,
  ): StatesJsonInterface => {
    // TODO: currently doesn't really catch infinite loops

    const stateName = state.getName();
    const nextState = state.getNextState();

    const stateAlreadyPresent = Object.prototype.hasOwnProperty.call(
      baseStatesJsonObject, stateName,
    );
    const statesJsonObject = { ...baseStatesJsonObject };

    if (!stateAlreadyPresent) {
      statesJsonObject[stateName] = state.getJsonObject();
    }

    return (stateAlreadyPresent || nextState === undefined)
      ? statesJsonObject : this.collectStatesJsonObject(statesJsonObject, state.getNextState());
  };

  getJsonObject = (): StateMachineJsonInterface => {
    const jsonObject: StateMachineJsonInterface = {
      StartAt: this.startingState.getName(),
      States: this.collectStatesJsonObject({}, this.startingState),
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
StartAt: ${this.getStartingState().getName()}
TimeoutSeconds: ${this.timeoutSeconds || 'N/A'}`;

  getStartingState = (): State => this.startingState;
}
