import demoStateMachine from './demo';

describe('demoStateMachine compilation', () => {
  const compilationResponse = demoStateMachine.compile();
  it('should compile without errors', () => {
    expect(compilationResponse.validation.errors).toMatchObject([]);
  });
});
