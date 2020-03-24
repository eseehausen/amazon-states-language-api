export default interface StateJsonInterface {
  Type: string;
  Comment?: string;
  Next?: string;
  End?: boolean;
  // InputPath?: string|null|undefined;
  // OutputPath?: string|null|undefined;
  // ResultPath?: string|null|undefined;
  // Parameters?: Json;
  // Retry?: [Json]; // TODO interface for this
  // Catch?: [Json]; // TODO interface for this
}
