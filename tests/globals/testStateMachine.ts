import testPassState from './testPassState';
import StateMachine from '../../src/stateMachine/StateMachine';
import testTaskState from './testTaskState';
import testWaitState from './testWaitState';

const startingState = testTaskState.setNextState(testWaitState).setNextState(testPassState);
const testStateMachine: StateMachine = new StateMachine(
  startingState.getStateJsonInformationGeneratorFunction(),
  'Test State Machine',
  100,
);

export default testStateMachine;
