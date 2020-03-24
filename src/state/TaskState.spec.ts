import TaskState from './TaskState';
import ResourceInterface from './ResourceInterface';

const testOutputString = 'outputted';
const testName = 'Test Task';
const testComment = 'Test Comment';

const testResource: ResourceInterface = {
  uri: 'arn:partition:service:region:account:task_type:name',
  mock: (input) => ([input, testOutputString]),
};

const testTaskState = new TaskState(
  testName,
  testResource,
  testComment,
);

describe('getSimulationOutputJson', () => {
  test('should successfully run mock', () => {
    const testInputString = 'inputted';
    const outputObject = testTaskState.getSimulationOutput(testInputString).jsonObject;
    expect(outputObject).toEqual([testInputString, testOutputString]);
  });
});

describe('getJsonObject', () => {
  test('should assign URI to Resource', () => {
    const jsonObject = testTaskState.getJsonObject();
    expect(jsonObject).toEqual(expect.objectContaining({
      Resource: testResource.uri,
    }));
  });
});
