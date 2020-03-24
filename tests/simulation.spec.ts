import simulateStateMachine from '../src/simulation/simulateStateMachine';
import testStateMachine from './globals/testStateMachine';
import testTaskState from './globals/testTaskState';
import testPassState from './globals/testPassState';

describe('simulationIntegrationTest', () => {
  test('should interpret basic StateMachine and provide output', () => {
    const startingInput = {
      startingInput: 'start',
    };
    const outputString = simulateStateMachine(
      testStateMachine.getSimulationOutput(), // TODO test this interface
      testTaskState.setNextState(testPassState),
      startingInput,
    );
    expect(outputString).toContain(testTaskState.getName());
    expect(outputString).toContain(testPassState.getName());

    const startingOutput = testTaskState.getSimulationOutput(startingInput);

    expect(outputString).toContain(startingOutput.string);
    expect(outputString)
      .toContain(testPassState.getSimulationOutputString(startingOutput.jsonObject));
    // TODO need to better organize this, since it's too dependent on knowing the imports.
  });
});
