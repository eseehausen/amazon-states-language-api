import StateJsonInterface from '../StateJsonInterface';

export default interface TaskStateJsonInterface extends StateJsonInterface {
  Next?: string;
  End?: boolean;
  Resource: string;
  // TimeoutSeconds?: number;
  // HeartbeatSeconds?: number;
}
