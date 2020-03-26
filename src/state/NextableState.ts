import State from './State';
import StateJsonInterface from './StateJsonInterface';

interface NextableStateJsonInterface extends StateJsonInterface {
  Next?: string;
}

export default abstract class NextableState extends State {
  protected constructor(
    type: string,
    name: string,
    protected next: State|null,
    comment?: string,
  ) {
    super(type, name, comment);
  }

  isEndState = (): boolean => this.next === null;

  setNextState = (nextState: State): this => {
    // return State for chaining
    this.next = nextState;
    return this;
  };

  appendState = <T extends State>(appendedState: T): T => {
    // return appendedState for chaining
    this.setNextState(appendedState);
    return appendedState;
  };

  getJsonObject(): NextableStateJsonInterface {
    const baseJsonObject = super.getJsonObject();
    return this.isEndState() ? baseJsonObject : {
      ...baseJsonObject,
      Next: this.next.getName(),
    };
  }
}
