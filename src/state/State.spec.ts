import State from './State';

const testInput = {
  a: 'a',
  b: 'b',
  c: { d: 'd' },
};
describe('tracePath', () => {
  it('should return fields properly', () => {
    expect(State.tracePath(testInput, '$')).toBe(testInput);
    expect(State.tracePath(testInput, '$.a')).toBe('a');
    expect(State.tracePath(testInput, '$.c.d')).toBe('d');
  });

  it('should throw an error if path does not match input', () => {
    expect(() => State.tracePath(testInput, '$.e')).toThrowError();
  });
});
