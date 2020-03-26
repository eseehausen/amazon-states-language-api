import StateJsonInterface from '../StateJsonInterface';

export default interface PassStateJsonInterface extends StateJsonInterface {
  Next?: string;
  End?: boolean;
  Result?: Json;
}
