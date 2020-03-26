import testStateMachine from './globals/testStateMachine';
import compileJsonStateMachine from '../src/compileJsonStateMachine';

describe('compilationIntegrationTest', () => {
  it('should compile basic types without validation errors', () => {
    const compilationResult = compileJsonStateMachine(testStateMachine.getJsonObject());
    if (!compilationResult.validation.passed) {
      console.log(compilationResult);
    }
    expect(compilationResult.validation.passed).toBe(true);
  });
});
