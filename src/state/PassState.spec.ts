import PassState from './PassState';

const testResult = { test: 'result' };
const onlyNextPassStateName = 'First Pass State';
const endPassStateWithCommentAndResultName = 'Second Pass State';
const testComment = 'Test Comment';

const endPassStateWithCommentAndResult = new PassState(
  endPassStateWithCommentAndResultName, testResult, undefined, testComment,
);
const onlyNextPassState = new PassState(
  onlyNextPassStateName, undefined, endPassStateWithCommentAndResult,
);

describe('getSimulationOutput', () => {
  const testInputString = 'inputted';
  const onlyNextPassStateOutput = onlyNextPassState.getSimulationOutput(testInputString);
  const endPassStateWithCommentAndResultOutput = endPassStateWithCommentAndResult
    .getSimulationOutput(testInputString);

  test('should successfully pass through input', () => {
    expect(onlyNextPassStateOutput.jsonObject).toEqual(testInputString);
  });

  test('should successfully pass through result', () => {
    expect(endPassStateWithCommentAndResultOutput.jsonObject).toEqual(testResult);
  });

  test('should show name, comment, and expected result in string output', () => {
    expect(onlyNextPassStateOutput.string).toContain(onlyNextPassState.getName());
    expect(onlyNextPassStateOutput.string).toContain(JSON.stringify(testInputString));
    expect(onlyNextPassStateOutput.string).not.toContain('Comment:');

    expect(endPassStateWithCommentAndResultOutput.string).toContain(testComment);
    expect(endPassStateWithCommentAndResultOutput.string).toContain(JSON.stringify(testResult));
  });
});

describe('getJsonObject', () => {
  test('returns JSON ready information about pass state (and general state)', () => {
    expect(endPassStateWithCommentAndResult.getJsonObject()).toEqual({
      Type: 'Pass',
      Comment: testComment,
      Result: JSON.stringify(testResult),
      End: true,
    });

    expect(onlyNextPassState.getJsonObject()).toEqual({
      Type: 'Pass',
      End: false,
      Next: endPassStateWithCommentAndResultName,
    });
  });
});
