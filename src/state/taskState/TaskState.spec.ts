import TaskState from './TaskState';
import ResourceInterface from './ResourceInterface';
import testPassState from '../../../tests/globals/testPassState';

const testOutputString = 'outputted';
const testName = 'Test Task';

const testResource: ResourceInterface = {
  uri: 'arn:partition:service:region:account:task_type:name',
  mock: (input) => ([input, testOutputString]),
};

const testTaskState = new TaskState(testName, testResource, testPassState);
// TODO test URI validation
describe('getOutput', () => {
  const testInputString = 'inputted';
  const taskStateOutput = testTaskState.getSimulatedOutput(testInputString);
  it('should successfully run mock and output result', () => {
    expect(taskStateOutput.output).toEqual([testInputString, testOutputString]);
  });
});
