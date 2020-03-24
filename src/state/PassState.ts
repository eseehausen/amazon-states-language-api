import State from './State';
import PassStateJsonInterface from './PassStateJsonInterface';

export default class PassState extends State {
  constructor(
    name: string,
    private result?: Json,
    next?: State,
    comment?: string,
  ) {
    super('Pass', name, comment, next);
  }

  isEndState = (): boolean => this.next === undefined;

  // needed for abstract constructor call
  // eslint-disable-next-line class-methods-use-this
  canHaveNextState(): boolean {
    return true;
  }

  getNextState = (): State|undefined => this.next;

  getJsonObject = (): PassStateJsonInterface => {
    const passStateJsonObject: PassStateJsonInterface = { ...this.getBaseJsonObject(true) };
    if (this.result) {
      passStateJsonObject.Result = JSON.stringify(this.result);
    }
    return passStateJsonObject;
  };

  getSimulationOutputJsonObject = (input: Json): Json => this.result || input;
}
