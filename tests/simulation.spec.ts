import StateMachineInterpreter from '../src/StateMachineInterpreter';
import testStateMachine from './globals/testStateMachine';
import testTaskState from './globals/testTaskState';
import testPassState from './globals/testPassState';

describe('simulationIntegrationTest', () => {
  test('should interpret basic StateMachine and provide output', () => {
    const startingInput = {
      startingInput: 'start',
    };
    const outputString = StateMachineInterpreter.simulateStateMachine(
      testStateMachine.getSimulationOutputString(), // TODO test these interfaces
      testTaskState.setNextState(testPassState).getOutputGeneratorFunction(),
      startingInput,
    );
    expect(outputString).toContain(testTaskState.getName());
    expect(outputString).toContain(testPassState.getName());

    const simulationOutputIterator = testTaskState.getOutputGeneratorFunction()(startingInput);
    const startingOutput = simulationOutputIterator.next().value;

    console.log(outputString);

    expect(outputString).toContain(JSON.stringify(startingOutput.output));
    expect(outputString)
      .toContain(JSON.stringify(startingOutput.stateJsonObject));

    const finalOutputResult = simulationOutputIterator.next();
    const finalOutput = finalOutputResult.value;


    expect(outputString).toContain(JSON.stringify(finalOutput.output));
    expect(outputString)
      .toContain(JSON.stringify(finalOutput.stateJsonObject));
    // TODO need to better organize this, since it's too dependent on knowing the imports
    //  also iterate over the states when checking

    expect(finalOutputResult.done).toBe(false);
    expect(simulationOutputIterator.next().done).toBe(true);
  });
});
