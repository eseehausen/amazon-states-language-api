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

  getJsonObject = (): FailStateJsonInterface => {
    // TODO handle this better
    const jsonObject = {
      ...super.getJsonObject(),
      Error: this.error,
      Cause: this.cause,
    };
    delete jsonObject.End;
    return jsonObject;
  };

  getSimulationOutputJsonObject = (input: Json): Json => input;
}
