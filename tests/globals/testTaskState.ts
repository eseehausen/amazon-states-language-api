import TaskState from '../../src/state/TaskState';
import { EXAMPLE_URI } from '../../src/state/ResourceInterface';

const testTaskState: TaskState = new TaskState(
  'Test Task State',
  {
    uri: EXAMPLE_URI,
    mock: (input): Array<Json> => [input, 'outputted'],
  },
  'Wraps input in array with \'outputted\'',
);

export default testTaskState;
