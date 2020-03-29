import State from '../State';
import SucceedStateJsonInterface from './SucceedStateJsonInterface';

export default class SucceedState extends State {
  constructor(name: string, comment?: string) {
    super('Succeed', name, comment);
  }

  getJsonObject(): SucceedStateJsonInterface {
    // TODO handle this better
    const jsonObject = { ...super.getJsonObject() };
    delete jsonObject.End;
    return jsonObject;
  }

  protected getSimulationOutputJsonObject = (input?: Json): Json => input;

  protected isEndState = (): boolean => true;
}
