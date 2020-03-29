import TaskState from './TaskState';
import ResourceInterface from './ResourceInterface';
import testPassState from '../../../tests/globals/testPassState';
import PassState from '../passState/PassState';
import TaskStateCatch from './TaskStateCatch';

const testInputString = 'inputted';
const testOutputString = 'outputted';
const testName = 'Test Task';

let timesRun = 1;
// eslint-disable-next-line no-plusplus
const mockFunction = (input): string[] => ([input, testOutputString, timesRun++]);

// eslint-disable-next-line @typescript-eslint/no-unused-vars
const mockErrorFunction = (input: Json): Json => ({
  errorType: 'arbitrary',
  test: testOutputString,
});

const testUri = 'arn:partition:service:region:account:task_type:name';
const testResource: ResourceInterface = {
  uri: testUri,
  mock: mockFunction,
};

const testErrorResource: ResourceInterface = {
  uri: testUri,
  mock: mockErrorFunction,
};

const testErrorPassState = new PassState('Error pass state');
const testTaskState = new TaskState(testName, testResource, testPassState);
const testErrorTaskState = new TaskState(testName, testErrorResource, testPassState);
const testFailedErrorTaskState = new TaskState(testName, testErrorResource, testPassState);

testErrorTaskState.addCatch(
  new TaskStateCatch(
    [TaskStateCatch.CATCH_ALL_ERRORS], '$.test', testErrorPassState,
  ),
);

testErrorTaskState.addCatch(
  new TaskStateCatch(['should not work'], '$.notWork', testErrorPassState),
);

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
  const expectedOutputJsonObject = [testInputString, testOutputString, 1];

  it('should successfully run mock and output result', () => {
    expect(testTaskState.getSimulatedOutput(testInputString).output)
      .toEqual(expectedOutputJsonObject);
  });

  it('should cache result', () => { // for now
    expect(testTaskState.getSimulatedOutput(testInputString).output)
      .toEqual(expectedOutputJsonObject);
  });

  it('should run error mock and output response', () => {
    expect(testErrorTaskState.getSimulatedOutput(testInputString).output).toEqual(testOutputString);
  });
});

describe('getNextState', () => {
  it('should return appropriate next state', () => {
    expect(testTaskState.getNextState(testInputString)).toEqual(testPassState);
  });

  it('should return appropriate next state', () => {
    expect(testErrorTaskState.getNextState(testInputString)).toEqual(testErrorPassState);
  });

  it('should throw an error if there is no appropriate catch', () => {
    expect(() => testFailedErrorTaskState.getNextState(testInputString)).toThrowError();
  });
});
