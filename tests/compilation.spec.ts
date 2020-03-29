import testStateMachine from './globals/testStateMachine';

describe('compilationIntegrationTest', () => {
  it('should compile basic types without validation errors', () => {
    const compilationResult = testStateMachine.compile();
    if (!compilationResult.validation.passed) {
      console.log(compilationResult);
    }
    expect(compilationResult.validation.passed).toBe(true);
  });
});
