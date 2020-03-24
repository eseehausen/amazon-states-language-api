import testStateMachine from './globals/testStateMachine';
import compileJsonStateMachine from '../src/compileJsonStateMachine';

describe('compilationIntegrationTest', () => {
  test('should compile basic types without validation errors', () => {
    const compilationResult = compileJsonStateMachine(testStateMachine.getJsonObject());
    expect(compilationResult.validation.passed).toBe(true);
    if (!compilationResult.validation.passed) {
      console.log(compilationResult);
    }
  });
});
