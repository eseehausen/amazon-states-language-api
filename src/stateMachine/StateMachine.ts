import StateMachineJsonInterface from './StateMachineJsonInterface';
import StatesJsonInterface from './StatesJsonInterface';
import validateField from '../validateField';
import StateJsonInformationInterface from '../state/StateJsonInformationInterface';


// TODO - allow this class to copy a chain of states to lock it in
export default class StateMachine {
  private version = '1.0';
  // this is the current default and the spec this is based on

  private readonly statesJsonObject: StatesJsonInterface;

  private readonly startAt: string;

  constructor(
    stateJsonInformationGeneratorFunction: () => Generator<StateJsonInformationInterface>,
    private comment?: string,
    private timeoutSeconds?: number,
  ) {
    this.statesJsonObject = this.collectStatesJsonObject(
      {}, stateJsonInformationGeneratorFunction(),
    );

    this.startAt = stateJsonInformationGeneratorFunction().next().value.name;

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

  collectStatesJsonObject = (
    baseStatesJsonObject: StatesJsonInterface,
    stateJsonInformationIterator: IterableIterator<StateJsonInformationInterface>,
  ): StatesJsonInterface => {
    const stateJsonInformationIteratorResult = stateJsonInformationIterator.next();
    if (!stateJsonInformationIteratorResult.done) {
      const { name, jsonObject } = stateJsonInformationIteratorResult.value;
      const stateAlreadyPresent = Object.prototype.hasOwnProperty.call(
        baseStatesJsonObject, name,
      );
      if (!stateAlreadyPresent) {
        return this.collectStatesJsonObject(
          {
            ...baseStatesJsonObject,
            [name]: jsonObject,
          },
          stateJsonInformationIterator,
        );
      }
    }
    return baseStatesJsonObject;
  };

  getJsonObject = (): StateMachineJsonInterface => {
    const jsonObject: StateMachineJsonInterface = {
      StartAt: this.startAt,
      States: this.statesJsonObject,
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
StartAt: ${this.startAt}
TimeoutSeconds: ${this.timeoutSeconds || 'N/A'}`;
}
