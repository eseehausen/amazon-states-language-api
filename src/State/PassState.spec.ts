import PassState from './PassState';

describe('getJsonObject', () => {
  test('returns JSON ready information about pass state', () => {
    const firstPassStateName = 'First Pass State';
    const secondPassStateName = 'Second Pass State';
    const exampleComment = 'Test Comment';

    const secondPassState = new PassState(
      secondPassStateName,
      exampleComment,
    );
    const firstPassState = new PassState(
      firstPassStateName,
      undefined,
      secondPassState,
    );

    expect(firstPassState.getJsonObject()).toEqual({
      Type: 'Pass',
      End: false,
      Next: secondPassStateName,
    });

    expect(secondPassState.getJsonObject()).toEqual({
      Type: 'Pass',
      End: true,
      Comment: exampleComment,
    });
  });
});
