import WaitState from './WaitState';

// jest.useFakeTimers();

const testInputString = 'Test Input String';
const testWaitStateName = 'Wait State';
const testSeconds = 20;

const testWaitState = new WaitState(testWaitStateName, testSeconds, null);

describe('getSimulatedOutput', () => {
  it('should successfully pass through input after delay', () => {
    const waitStateOutput = testWaitState.getSimulatedOutput(testInputString);
    expect(waitStateOutput).toMatchObject({
      input: testInputString,
      output: testInputString,
      stateJsonObject: {
        Type: 'Wait',
        Seconds: testSeconds,
      },
    });
  });
});
