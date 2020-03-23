import State from './State';
import PassStateJsonInterface from './PassStateJsonInterface';

export default class PassState extends State {
  constructor(
    name: string,
    comment?: string,
    next?: State,
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
    const passStateJsonObject: PassStateJsonInterface = { ...this.getBaseJsonObject() };

    if (this.next !== undefined) {
      passStateJsonObject.Next = this.next.getName();
    }

    passStateJsonObject.End = this.isEndState();
    return passStateJsonObject;
  };
}
