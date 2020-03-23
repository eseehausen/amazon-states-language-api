import StateJsonInterface from './StateJsonInterface';

export default interface PassStateJsonInterface extends StateJsonInterface { // TODO
  // InputPath?: string|null|undefined;
  // OutputPath?: string|null|undefined;
  // Result?: any;
  // ResultPath?: string|null|undefined;
  // Parameters?: any;
  Next?: string;
  End?: boolean;
}
