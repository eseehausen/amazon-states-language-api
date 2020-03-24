import PassState from '../state/PassState';
import StateMachine from './StateMachine';

describe('getJsonObject', () => {
  test('returns JSON ready information about StateMachine', () => {
    const version = '1.0';
    const firstStateName = 'First State';
    const secondStateName = 'Second State';
    const thirdStateName = 'Final State';

    const stateMachineComment = 'Test comment';
    const stateMachineTimeout = 100;

    const startingState = new PassState(firstStateName);
    const finalState = new PassState(thirdStateName);
    startingState.appendState(new PassState(secondStateName))
      .appendState(finalState);

    const stateMachine = new StateMachine(
      startingState,
      stateMachineComment,
      stateMachineTimeout,
    );

    const firstJsonObject = stateMachine.getJsonObject();

    expect(firstJsonObject).toEqual(expect.objectContaining({
      Comment: stateMachineComment,
      StartAt: firstStateName,
      Version: version,
      TimeoutSeconds: stateMachineTimeout,
    }));
    expect(Object.keys(firstJsonObject.States).length).toEqual(3);

    const sparseStateMachine = new StateMachine(finalState);
    expect(sparseStateMachine.getStartingState()).toEqual(finalState);
    expect(sparseStateMachine.getJsonObject()).toEqual({
      StartAt: thirdStateName,
      Version: version,
      States: {
        [thirdStateName]: finalState.getJsonObject(),
      },
    });
  });
});
