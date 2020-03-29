import TaskStateCatch from './TaskStateCatch';
import PassState from '../passState/PassState';

const testPassState = new PassState('Test Error Landing');

const notWorkingErrorType1 = 'Nothing worked here';
const notWorkingErrorType2 = 'Or here';

const targetedErrorValue = 'success';
const testErrorData = {
  errorMessage: 'here is an error',
  test: targetedErrorValue,
};

const workingTaskErrorEqualsSet = [
  notWorkingErrorType1,
  TaskStateCatch.CATCH_ALL_ERRORS,
];
const workingTaskResultPath = '$.test';

const workingTaskStateCatch = new TaskStateCatch(
  workingTaskErrorEqualsSet,
  workingTaskResultPath,
  testPassState,
);

const notWorkingTaskStateCatch = new TaskStateCatch(
  [
    notWorkingErrorType1,
    notWorkingErrorType2,
  ],
  '$.badResult',
  testPassState,
);

describe('getJsonObject', () => {
  it('should return a correct JSON object', () => {
    expect(workingTaskStateCatch.getJsonObject()).toMatchObject({
      ErrorEquals: workingTaskErrorEqualsSet,
      ResultPath: workingTaskResultPath,
      Next: testPassState.getName(),
    });
  });
});

describe('catchesError', () => {
  it('should catch error with appropriate handler', () => {
    expect(workingTaskStateCatch.catchesError()).toBe(true);
  });

  it('should not catch error without appropriate handler', () => {
    expect(notWorkingTaskStateCatch.catchesError()).toBe(false);
  });
});

describe('getNextState', () => {
  it('should get a next state', () => {
    expect(workingTaskStateCatch.getNextState()).toEqual(testPassState);
  });
});

describe('getOutputJson', () => {
  it('should get a next state with an appropriate error handler', () => {
    expect(workingTaskStateCatch.getOutputJson(testErrorData)).toEqual(targetedErrorValue);
  });
});
