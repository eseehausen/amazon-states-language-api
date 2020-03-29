import compileJsonStateMachine from './compileJsonStateMachine';

test('Basic compilation', () => {
  const goodStateMachine = {
    Comment: 'A simple minimal example of the States language',
    StartAt: 'Hello World',
    States: {
      'Hello World': {
        Type: 'Pass',
        End: true,
      },
    },
  };
  expect(compileJsonStateMachine(goodStateMachine).validation.passed).toBe(true);

  const badStartAtStateMachine = {
    Comment: 'A simple minimal example of the States language',
    StartAt: 'Not Present',
    States: {
      'Hello World': {
        Type: 'Pass',
        End: true,
      },
    },
  };
  expect(compileJsonStateMachine(badStartAtStateMachine).validation.passed).toBe(false);
});
