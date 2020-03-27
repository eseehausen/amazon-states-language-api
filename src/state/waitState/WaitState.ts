import State from '../State';
import WaitStateJsonInterface from './WaitStateJsonInterface';
import NextableState from '../NextableState';
import validateField from '../../validateField';

export default class WaitState extends NextableState {
  constructor(
    name: string,
    next: State | null = null,
    private readonly seconds: number, // required for now since it's the only supported option
    comment?: string,
  ) {
    super('Wait', name, next, comment);
    validateField(seconds, {
      errorMessage: `Non-positive integer seconds (${seconds}) in task ${name}.`,
      // > 0 handles NaN as well
      test: (secondsValue: number): boolean => secondsValue > 0 && Number.isInteger(secondsValue),
    });
  }

  getNextState = (): State | null => this.next;

  getJsonObject = (): WaitStateJsonInterface => ({
    ...super.getJsonObject(),
    Seconds: this.seconds,
  });

  getSimulationOutputJsonObject = (input: Json): Json => input;
}
