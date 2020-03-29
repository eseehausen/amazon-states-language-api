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


const testTaskState = new TaskState(testName, testResource, testPassState);

describe('constructor', () => {
  it('should allow for the creation of a task state with valid uri', () => {
    expect(testTaskState).toBeInstanceOf(TaskState);
  });

  it('should not allow for the creation of a task state with an invalid uri', () => {
    expect(() => new TaskState(
      testName, { uri: 'Bad Uri', mock: mockFunction }, testPassState,
    )).toThrowError();
  });
});


// TODO test URI validation
describe('getSimulatedOutput', () => {
  const testInputString = 'inputted';

  const taskStateOutput = testTaskState.getSimulatedOutput(testInputString);
  it('should successfully run mock and output result', () => {
    expect(taskStateOutput.output).toEqual([testInputString, testOutputString]);
  });
});
