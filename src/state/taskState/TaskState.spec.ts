import TaskState from './TaskState';
import ResourceInterface from './ResourceInterface';
import testPassState from '../../../tests/globals/testPassState';

const testOutputString = 'outputted';
const testName = 'Test Task';

const mockFunction = (input): string[] => ([input, testOutputString]);
const testResource: ResourceInterface = {
  uri: 'arn:partition:service:region:account:task_type:name',
  mock: mockFunction,
};


const noNextTaskState = new TaskState(testName, testResource, null);

describe('constructor', () => {
  it('should allow for the creation of a task state with valid uri', () => {
    expect(noNextTaskState).toBeInstanceOf(TaskState);
  });

  it('should not allow for the creation of a task state with an invalid uri', () => {
    expect(() => new TaskState(testName, { uri: 'Bad Uri', mock: mockFunction }))
      .toThrowError();
  });
});


const testTaskState = new TaskState(testName, testResource, testPassState);
// TODO test URI validation
describe('getSimulatedOutput', () => {
  const testInputString = 'inputted';

  it('should throw an error if no next state has been added', () => {
    expect(() => noNextTaskState.getSimulatedOutput(testInputString)).toThrowError();
  });

  const taskStateOutput = testTaskState.getSimulatedOutput(testInputString);
  it('should successfully run mock and output result', () => {
    expect(taskStateOutput.output).toEqual([testInputString, testOutputString]);
  });
});
