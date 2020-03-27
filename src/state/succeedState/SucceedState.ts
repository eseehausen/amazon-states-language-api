import State from '../State';
import SucceedStateJsonInterface from './SucceedStateJsonInterface';

export default class SucceedState extends State {
  constructor(name: string, comment?: string) {
    super('Succeed', name, comment);
  }

  getJsonObject(): SucceedStateJsonInterface {
    return super.getJsonObject();
  }

  getNextState = (): null => null;

  protected getSimulationOutputJsonObject = (input?: Json): Json => input;

  protected isEndState = (): boolean => true;
}
