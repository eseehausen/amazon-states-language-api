import StateJsonInterface from '../StateJsonInterface';
import TaskStateCatchInterface from './TaskStateCatchJsonInterface';

export default interface TaskStateJsonInterface extends StateJsonInterface {
  Next?: string;
  End?: boolean;
  Resource: string;
  Catch?: TaskStateCatchInterface[];
  // TimeoutSeconds?: number;
  // HeartbeatSeconds?: number;
}
