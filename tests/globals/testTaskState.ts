import TaskState from '../../src/state/taskState/TaskState';
import { EXAMPLE_URI } from '../../src/state/taskState/ResourceInterface';

const testTaskState: TaskState = new TaskState('Test Task State', {
  uri: EXAMPLE_URI,
  mock: (input): Array<Json> => [input, 'outputted'],
}, null, 'Wraps input in array with \'outputted\'');

export default testTaskState;
