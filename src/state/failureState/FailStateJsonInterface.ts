import StateJsonInterface from '../StateJsonInterface';

export default interface FailStateJsonInterface extends StateJsonInterface {
  Error: string;
  Cause: string;
}
