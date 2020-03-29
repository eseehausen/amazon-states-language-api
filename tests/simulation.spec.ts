import testStateMachine, { defaultResult } from './globals/testStateMachine';
import testTaskState from './globals/testTaskState';
import testPassState from './globals/testPassState';
import { testSeconds } from './globals/testWaitState';

describe('simulationIntegrationTest', () => {
  it('should interpret basic StateMachine and provide output', () => {
    const startingInput = {
      startingInput: 'start',
    };

    const outputString = testStateMachine.simulate(startingInput);

    expect(outputString).toContain(testTaskState.getName());
    expect(outputString).toContain(testPassState.getName());

    const simulationOutputIterator = testTaskState.getOutputGeneratorFunction()(startingInput);
    const startingOutput = simulationOutputIterator.next().value;

    expect(outputString).toContain(JSON.stringify(startingOutput.output));
    expect(outputString)
      .toContain(JSON.stringify(startingOutput.stateJsonObject));

    const secondOutputResult = simulationOutputIterator.next();
    const secondOutput = secondOutputResult.value;


    expect(outputString).toContain(JSON.stringify(secondOutput.output));
    expect(outputString)
      .toContain(JSON.stringify(secondOutput.stateJsonObject));
    // TODO need to better organize this, since it's too dependent on knowing the imports
    //  also iterate over the states when checking

    expect(outputString).toContain(`Simulated Seconds Delayed: ${testSeconds}`);

    expect(outputString).toContain(defaultResult);

    expect(secondOutputResult.done).toBe(false);
  });
});
