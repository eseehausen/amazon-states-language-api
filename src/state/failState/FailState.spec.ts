import FailState from './FailState';

const testName = 'Test Name';
const testError = 'Test Error';
const testCause = 'Test Cause';

const testFailState = new FailState(
  testName, testError, testCause,
);

describe('getOutput', () => {
  const testInputString = 'inputted';
  const failStateOutput = testFailState.getSimulatedOutput(testInputString);
  it('should end and pass through the input', () => {
    expect(failStateOutput).toMatchObject({
      input: testInputString,
      output: testInputString,
      stateJsonObject: {
        Type: 'Fail',
        Error: testError,
        Cause: testCause,
      },
    });
  });
});
