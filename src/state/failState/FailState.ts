import State from '../State';
import FailStateJsonInterface from './FailStateJsonInterface';

export default class FailState extends State {
  constructor(
    name: string,
    private error: string,
    private cause: string,
    comment?: string,
  ) {
    super('Fail', name, comment);
  }

  isEndState = (): boolean => true;

  getNextState = (): null => null;

  getJsonObject = (): FailStateJsonInterface => ({
    ...super.getJsonObject(),
    Error: this.error,
    Cause: this.cause,
  });

  getSimulationOutputJsonObject = (input: Json): Json => input;
}
