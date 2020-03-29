import testPassState from './testPassState';
import StateMachine from '../../src/stateMachine/StateMachine';
import testTaskState from './testTaskState';
import testWaitState from './testWaitState';
import ChoiceState from '../../src/state/choiceState/ChoiceState';
import ChoiceRule from '../../src/state/choiceState/ChoiceRule';
import SucceedState from '../../src/state/succeedState/SucceedState';
import FailState from '../../src/state/failState/FailState';
import PassState from '../../src/state/passState/PassState';

export const defaultResult = 'Default Result';
const defaultEndState = new PassState('Default End', null, defaultResult);

const choiceState = new ChoiceState('Choice State', undefined, defaultEndState);

const succeedState = new SucceedState('Success');

const failState = new FailState('Failure', 'Error', 'Cause');

choiceState.addChoice(ChoiceRule.booleanEquals(true), succeedState)
  .addChoice(ChoiceRule.booleanEquals(false), failState);

const startingState = testTaskState;
testTaskState.appendState(testWaitState)
  .appendState(testPassState)
  .appendState(choiceState);

const testStateMachine: StateMachine = new StateMachine(
  startingState,
  'Test State Machine',
  100,
);

export default testStateMachine;
