import SucceedState from './SucceedState';

const testSucceedState = new SucceedState('Test State');

describe('getSimulatedOutput', () => {
  const testInputString = 'inputted';
  const failStateOutput = testSucceedState.getSimulatedOutput(testInputString);
  it('should end and pass through the input', () => {
    expect(failStateOutput).toMatchObject({
      input: testInputString,
      output: testInputString,
      stateJsonObject: {
        Type: 'Succeed',
        End: true,
      },
    });
  });
});
