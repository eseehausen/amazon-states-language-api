import PassState from '../state/PassState';
import StateMachine from '../stateMachine/StateMachine';
import interpretStateMachine from './interpretStateMachine';

test('Basic state machine interpretation', () => {
  const firstStateName = 'First State';
  const secondStateName = 'Second State';
  const thirdStateName = 'Final State';
  const testComment = 'Test Comment';
  const testTimeout = 100;


  const startingState = new PassState(firstStateName);
  const nextState = new PassState(secondStateName);
  const finalState = new PassState(thirdStateName);

  const stateMachine = new StateMachine(startingState, testComment, testTimeout);

  const firstResult = interpretStateMachine(
    stateMachine.getSimulationOutput(),
    stateMachine.getStartingState(),
  );

  [firstStateName, testComment, testTimeout].forEach(
    (value: string) => expect(firstResult).toContain(value),
  );
  expect(firstResult).not.toContain(secondStateName);

  startingState.appendState(nextState).appendState(finalState);

  const secondResult = interpretStateMachine(
    stateMachine.getSimulationOutput(),
    stateMachine.getStartingState(),
  );
  [firstStateName, secondStateName, thirdStateName].forEach(
    (value: string) => expect(secondResult).toContain(value),
  );
});
