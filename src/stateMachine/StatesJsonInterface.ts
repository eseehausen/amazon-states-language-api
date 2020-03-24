import StateJsonInterface from '../state/StateJsonInterface';

export default interface StatesJsonInterface {
  [name: string]: StateJsonInterface;
}
