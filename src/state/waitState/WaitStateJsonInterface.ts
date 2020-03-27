import StateJsonInterface from '../StateJsonInterface';

export default interface WaitStateJsonInterface extends StateJsonInterface {
  Next?: string;
  End?: boolean;
  Seconds: number; // required for now since it's the only one
  // TimestampPath?: string;
  // Timestamp?: string;
}
