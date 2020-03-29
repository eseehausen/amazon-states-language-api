import TaskState from '../src/state/taskState/TaskState';
import PassState from '../src/state/passState/PassState';
import ChoiceState from '../src/state/choiceState/ChoiceState';
import ChoiceRule from '../src/state/choiceState/ChoiceRule';
import SucceedState from '../src/state/succeedState/SucceedState';
import FailState from '../src/state/failState/FailState';
import WaitState from '../src/state/waitState/WaitState';
import StateMachine from '../src/stateMachine/StateMachine';
import TaskStateCatch from '../src/state/taskState/TaskStateCatch';

/********************************/
/*             DEMO             */
/*       You can run with       */
/*         npm run demo         */
/********************************/

const mockLambdaFunction = (): Json => {
  // the mock function that will decide how our state machine ends
  // switches things up for our choice state and to trigger error catch
  const randomNumber = Math.random();
  const errorRandomNumber = Math.random();
  let success;

  if (randomNumber < 0.33) {
    success = true;
  } else if (randomNumber < 0.66) {
    success = false;
  } else {
    success = null;
  }

  return { // mock lambda response goes here
    data: { sample: 'data' },
    miscellaneous: 'information',
    success,
    ...(errorRandomNumber < 0.1 ? { errorType: 'Error.type' } : {}),
  };
};

const resultPassState = new PassState(
  'Result Pass State Name',
  null, // no next state here, it's a terminal state!
  {
    final: 'Result',
  }, // this overrides the current input as of now
  'The basic state type- passes input or result through to output.',
);

const choiceState = new ChoiceState(
  'Choice State',
  resultPassState,
  'Checks for conditions to find next state, passes input through',
);

const successReferencePath = '$.success';

choiceState.addChoice(
  ChoiceRule.booleanEquals(
    true,
    successReferencePath,
  ),
  new SucceedState(
    'Success!',
    'The success field of the response was true!',
  ),
).addChoice(
  ChoiceRule.booleanEquals(
    false,
    successReferencePath,
  ),
  new FailState(
    'Failure.',
    'No success.',
    'Lambda mock returned false for success.',
    'The success field of the response was false.',
  ),
);

const taskState = new TaskState(
  'Task State',
  { // follows ResourceInterface, always has uri and mock
    uri: 'arn:aws:apigateway:us-east-1:lambda:path:/test/',
    mock: mockLambdaFunction,
  },
  choiceState, // next state required on constructor for TaskState
);
taskState.addCatch(new TaskStateCatch(
  [TaskStateCatch.CATCH_ALL_ERRORS],
  // only currently implemented catch type
  '$.errorType',
  new FailState(
    'Lambda Error',
    'Error returned.',
    'Lambda mock returned errorType field.',
    'That is the current way to simulate errors.',
  ),
));

const startingPassState = new PassState(
  'Starting state',
  null,
  undefined,
  'Starting state to demonstrate chaining',
);

const waitState = new WaitState(
  'Second state with a simulated wait',
  100,
  null,
  'The 100 second wait will show in simulated time',
);

startingPassState
  .appendState(waitState)
  .appendState(taskState);
// chaining with appendState - setNextState returns mutated object

const demoStateMachine = new StateMachine(
  startingPassState,
  'The state machine holder and simulation/compilation interface.',
  1000, // TimeoutSeconds- currently throws an error.
);

// return simulated output as string
console.log(demoStateMachine.simulate({ example: 'input' }));

// return compiled StateMachine with statelint error check (@wmfs/statelint JS port)
console.log(demoStateMachine.compile());
