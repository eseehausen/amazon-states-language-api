import StateJsonInterface from './StateJsonInterface';

export default interface TaskStateJsonInterface extends StateJsonInterface {
  Resource: string;
  // TimeoutSeconds?: number;
  // HeartbeatSeconds?: number;
}
