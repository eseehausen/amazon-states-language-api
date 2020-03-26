import PassState from './PassState';

// This is also where a lot of the base State/NextableState functionality testing current resides.

const testResult = { test: 'result' };
const testInputString = 'Test Input String';
const onlyNextPassStateName = 'First Pass State';
const endPassStateWithCommentAndResultName = 'Second Pass State';
const testComment = 'Test Comment';

const endPassStateWithCommentAndResult = new PassState(
  endPassStateWithCommentAndResultName, undefined, testResult, testComment,
);
const onlyNextPassState = new PassState(
  onlyNextPassStateName, endPassStateWithCommentAndResult, undefined,
);

describe('getSimulatedOutput', () => {
  const passThroughOutput = onlyNextPassState.getSimulatedOutput(testInputString);
  const resultOutput = endPassStateWithCommentAndResult.getSimulatedOutput(testInputString);

  it('should successfully pass through input and signal next state', () => {
    expect(passThroughOutput).toMatchObject({
      input: testInputString,
      output: testInputString,
      stateJsonObject: {
        Type: 'Pass',
        Next: endPassStateWithCommentAndResultName,
      },
    });
  });

  it('should successfully pass through result and end', () => {
    expect(resultOutput).toMatchObject({
      output: testResult,
      stateJsonObject: {
        Result: JSON.stringify(testResult),
        End: true,
      },
    });
  });
});
