import testStateMachine, { defaultResult } from './globals/testStateMachine';
import testTaskState from './globals/testTaskState';
import testPassState from './globals/testPassState';
import { testSeconds } from './globals/testWaitState';
import StateMachineInterpreter from '../src/stateMachineInterpreter/StateMachineInterpreter';
import StateMachine from '../src/stateMachine/StateMachine';
import WaitState from '../src/state/waitState/WaitState';
import PassState from '../src/state/passState/PassState';

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

    expect(outputString).toContain(JSON.stringify(
      startingOutput.output, null, StateMachineInterpreter.SIMULATION_JSON_SPACER,
    ));
    expect(outputString)
      .toContain(JSON.stringify(
        startingOutput.stateJsonObject, null, StateMachineInterpreter.SIMULATION_JSON_SPACER,
      ));

    const secondOutputResult = simulationOutputIterator.next();
    const secondOutput = secondOutputResult.value;


    expect(outputString).toContain(JSON.stringify(
      secondOutput.output, null, StateMachineInterpreter.SIMULATION_JSON_SPACER,
    ));
    expect(outputString)
      .toContain(JSON.stringify(
        secondOutput.stateJsonObject, null, StateMachineInterpreter.SIMULATION_JSON_SPACER,
      ));
    // TODO need to better organize this, since it's too dependent on knowing the imports
    //  also iterate over the states when checking

    expect(outputString).toContain(`Simulated Seconds Delayed: ${testSeconds}`);

    expect(outputString).toContain(defaultResult);

    expect(secondOutputResult.done).toBe(false);
  });

  it('should throw an error on timeout', () => {
    expect(() => (
      new StateMachine(
        new WaitState('Long wait', 1000),
        'No comment.',
        500,
      ).simulate({})
    )).toThrowError();
  });

  it('should stop chain but throw an error on infinite loop', () => {
    const firstPassState = new PassState('First');
    const secondPassState = new PassState('Second', firstPassState);

    expect(Object.keys(secondPassState.collectStatesJsonInformation({})))
      .toMatchObject(['Second', 'First']);

    firstPassState.setNextState(secondPassState);

    expect(Object.keys(firstPassState.collectStatesJsonInformation({})))
      .toMatchObject(['First', 'Second']);

    expect(() => (new StateMachine(firstPassState)).simulate({})).toThrowError();
  });
});
