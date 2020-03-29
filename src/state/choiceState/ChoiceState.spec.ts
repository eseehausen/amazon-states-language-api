import ChoiceState from './ChoiceState';
import PassState from '../passState/PassState';
import ChoiceRule from './ChoiceRule';

const falseEndPassStateName = 'False End';
const falseEndResult = 'False Result';
const falseEndPassState = new PassState(falseEndPassStateName, null, falseEndResult);

const trueEndResult = 'True Result';
const trueEndPassStateName = 'True End';
const trueEndPassState = new PassState(trueEndPassStateName, null, trueEndResult);

const defaultResult = 'Ok.';
const defaultEndPassStateName = 'Default End';
const defaultEndPassState = new PassState(defaultEndPassStateName, null, defaultResult);


const testChoiceState = new ChoiceState('Test State', defaultEndPassState, undefined);

const booleanEqualsTrueChoiceRule = ChoiceRule.booleanEquals(true, '$');
const booleanEqualsFalseChoiceRule = ChoiceRule.booleanEquals(false, '$');
testChoiceState.addChoice(
  booleanEqualsTrueChoiceRule, trueEndPassState,
).addChoice(
  booleanEqualsFalseChoiceRule, falseEndPassState,
);

describe('getSimulatedOutput', () => {
  const simulatedOutputGeneratorFunction = testChoiceState.getOutputGeneratorFunction();
  const trueSimulatedOutputGenerator = simulatedOutputGeneratorFunction(true);
  const trueSimulatedOutput = trueSimulatedOutputGenerator.next();
  it('should pass through the input', () => {
    expect(trueSimulatedOutput.value).toMatchObject({
      input: true,
      output: true,
      stateJsonObject: {
        Type: 'Choice',
        Choices: [
          {
            ...booleanEqualsTrueChoiceRule.getJsonObject(),
            Next: trueEndPassState.getName(),
          },
          {
            ...booleanEqualsFalseChoiceRule.getJsonObject(),
            Next: falseEndPassState.getName(),
          },
        ],
        Default: defaultEndPassState.getName(),
      },
    });
  });

  const falseSimulatedOutputGenerator = simulatedOutputGeneratorFunction(false);
  falseSimulatedOutputGenerator.next();
  it('should pick the correct next state', () => {
    expect(falseSimulatedOutputGenerator.next().value.output).toEqual(falseEndResult);
  });

  const defaultSimulatedOutputGenerator = simulatedOutputGeneratorFunction({});
  defaultSimulatedOutputGenerator.next();
  it('should pick the correct next state', () => {
    expect(defaultSimulatedOutputGenerator.next().value.output).toEqual(defaultResult);
  });
});
