import State from '../State';
import PassStateJsonInterface from './PassStateJsonInterface';
import NextableState from '../NextableState';

export default class PassState extends NextableState {
  constructor(
    name: string,
    next: State | null = null,
    private result?: Json,
    comment?: string,
  ) {
    super('Pass', name, next, comment);
  }

  getNextState = (): State|null => this.next;

  getJsonObject = (): PassStateJsonInterface => {
    const passStateJsonObject: PassStateJsonInterface = { ...super.getJsonObject() };
    if (this.result !== undefined) {
      passStateJsonObject.Result = JSON.stringify(this.result);
    }
    return passStateJsonObject;
  };

  getSimulationOutputJsonObject = (input: Json): Json => (
    this.result !== undefined ? this.result : input
  );
}
