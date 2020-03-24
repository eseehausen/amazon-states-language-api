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

describe('getOutputGeneratorFunction', () => {
  const testInputString = 'inputted';
  const passThroughOutputGeneratorFunction = onlyNextPassState.getOutputGeneratorFunction();
  const passThroughOutputIterator = passThroughOutputGeneratorFunction(testInputString);
  const passThroughOutput = passThroughOutputIterator.next().value;
  const resultOutput = passThroughOutputIterator.next().value;

  test('should successfully pass through input', () => {
    expect(passThroughOutput.jsonObject).toEqual(testInputString);
  });

  test('should successfully pass through result', () => {
    expect(resultOutput.jsonObject).toEqual(testResult);
  });

  test('should show name, comment, and expected result in string output', () => {
    expect(passThroughOutput.string).toContain(onlyNextPassState.getName());
    expect(passThroughOutput.string).toContain(JSON.stringify(testInputString));
    expect(passThroughOutput.string).not.toContain('Comment:');

    expect(resultOutput.string).toContain(testComment);
    expect(resultOutput.string).toContain(JSON.stringify(testResult));
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
