export default interface StateJsonInterface {
  Type: string;
  Comment?: string;
  End?: boolean;
  // choice can't have but we're going to leave it for now rather than break off another subtype
  // InputPath?: string|null|undefined;
  // OutputPath?: string|null|undefined;
  // ResultPath?: string|null|undefined;
  // Parameters?: Json;
  // Retry?: [Json]; // TODO interface for this
  // Catch?: [Json]; // TODO interface for this
}
