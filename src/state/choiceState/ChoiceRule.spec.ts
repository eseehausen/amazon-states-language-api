import ChoiceRule from './ChoiceRule';
import PassState from '../passState/PassState';

const startingStringTestValue = 'String test!';
const stringGreaterThanTestValue = 'String test!!';
const stringLessThanTestValue = 'String test';
const startingNumberTestValue = 5;
const numberGreaterThanTestValue = 6;
const numberLessThanTestValue = 4;
const startingTimestampValue = '2020-04-05T12:00:00Z';
const timestampGreaterThanTestValue = '2020-04-06T12:00:00Z';
const timestampLessThanTestValue = '2020-04-04T12:00:00Z';

const startingTestValues = {
  booleanEquals: true,
  stringEquals: startingStringTestValue,
  stringLessThan: startingStringTestValue,
  stringGreaterThan: startingStringTestValue,
  stringLessThanEquals: startingStringTestValue,
  stringGreaterThanEquals: startingStringTestValue,
  numericEquals: startingNumberTestValue,
  numericLessThan: startingNumberTestValue,
  numericGreaterThan: startingNumberTestValue,
  numericLessThanEquals: startingNumberTestValue,
  numericGreaterThanEquals: startingNumberTestValue,
  timestampEquals: startingTimestampValue,
  timestampLessThan: startingTimestampValue,
  timestampGreaterThan: startingTimestampValue,
  timestampLessThanEquals: startingTimestampValue,
  timestampGreaterThanEquals: startingTimestampValue,
};

const correctTestInput = {
  booleanEquals: true,
  stringEquals: startingStringTestValue,
  stringLessThan: stringLessThanTestValue,
  stringGreaterThan: stringGreaterThanTestValue,
  stringLessThanEquals: stringLessThanTestValue,
  stringGreaterThanEquals: stringGreaterThanTestValue,
  numericEquals: startingNumberTestValue,
  numericLessThan: numberLessThanTestValue,
  numericGreaterThan: numberGreaterThanTestValue,
  numericLessThanEquals: numberLessThanTestValue,
  numericGreaterThanEquals: numberGreaterThanTestValue,
  timestampEquals: startingTimestampValue,
  timestampLessThan: timestampLessThanTestValue,
  timestampGreaterThan: timestampGreaterThanTestValue,
  timestampLessThanEquals: timestampLessThanTestValue,
  timestampGreaterThanEquals: timestampGreaterThanTestValue,
};

const incorrectTestInput = {
  booleanEquals: false,
  stringEquals: stringLessThanTestValue,
  stringLessThan: stringGreaterThanTestValue,
  stringGreaterThan: stringLessThanTestValue,
  stringLessThanEquals: stringGreaterThanTestValue,
  stringGreaterThanEquals: stringLessThanTestValue,
  numericEquals: numberLessThanTestValue,
  numericLessThan: numberGreaterThanTestValue,
  numericGreaterThan: numberLessThanTestValue,
  numericLessThanEquals: numberGreaterThanTestValue,
  numericGreaterThanEquals: numberLessThanTestValue,
  timestampEquals: timestampGreaterThanTestValue,
  timestampLessThan: timestampGreaterThanTestValue,
  timestampGreaterThan: timestampLessThanTestValue,
  timestampLessThanEquals: timestampGreaterThanTestValue,
  timestampGreaterThanEquals: timestampLessThanTestValue,
};

const supplementaryCorrectTestInput = {
  stringLessThanEquals: startingStringTestValue,
  stringGreaterThanEquals: startingStringTestValue,
  numericLessThanEquals: startingNumberTestValue,
  numericGreaterThanEquals: startingNumberTestValue,
  timestampLessThanEquals: startingTimestampValue,
  timestampGreaterThanEquals: startingTimestampValue,
};

const choiceRuleBooleanTrue = ChoiceRule.booleanEquals(true, '$.true');
const choiceRuleBooleanFalse = ChoiceRule.booleanEquals(false, '$.false');
const booleanNestedRules = [
  choiceRuleBooleanTrue,
  choiceRuleBooleanFalse,
];

const booleanInputCorrect = {
  true: true,
  false: false,
};
const booleanInputBothTrue = {
  true: true,
  false: true,
};
const booleanInputBothIncorrect = {
  true: false,
  false: true,
};

const testNextState = new PassState('Success');


const baseAndChoiceRule = ChoiceRule.createBaseChoiceRule(
  ChoiceRule.and(booleanNestedRules), testNextState,
);
const baseOrChoiceRule = ChoiceRule.createBaseChoiceRule(
  ChoiceRule.or(booleanNestedRules), testNextState,
);
const baseNotChoiceRule = ChoiceRule.createBaseChoiceRule(
  ChoiceRule.not(choiceRuleBooleanFalse), testNextState,
);

const metConditionResultWithNoState = {
  metCondition: true,
  nextState: null,
};

const metConditionResultWithTestNextState = {
  metCondition: true,
  nextState: testNextState,
};

const didNotMeetConditionResultWithNoState = {
  metCondition: false,
  nextState: null,
};


describe('booleanTypes', () => {
  const booleanJsonObjects = booleanNestedRules.map(
    (choiceRule: ChoiceRule) => choiceRule.getJsonObject(),
  );
  it('should handle basic booleanEquals', () => {
    expect(booleanNestedRules[0].getSimulatedTestResult(booleanInputCorrect)).toMatchObject(
      metConditionResultWithNoState,
    );

    expect(booleanNestedRules[1].getSimulatedTestResult(booleanInputCorrect)).toMatchObject(
      metConditionResultWithNoState,
    );
  });

  // TODO DRY this out
  it('should properly process and', () => {
    expect(baseAndChoiceRule.getJsonObject()).toMatchObject({
      And: booleanJsonObjects,
    });
    expect(baseAndChoiceRule.getSimulatedTestResult(booleanInputCorrect)).toMatchObject(
      metConditionResultWithTestNextState,
    );

    expect(baseAndChoiceRule.getSimulatedTestResult(booleanInputBothTrue)).toMatchObject(
      didNotMeetConditionResultWithNoState,
    );

    expect(baseAndChoiceRule.getSimulatedTestResult(booleanInputBothIncorrect)).toMatchObject(
      didNotMeetConditionResultWithNoState,
    );
  });

  it('should properly process or', () => {
    expect(baseOrChoiceRule.getSimulatedTestResult(booleanInputCorrect)).toMatchObject(
      metConditionResultWithTestNextState,
    );

    expect(baseOrChoiceRule.getSimulatedTestResult(booleanInputBothTrue)).toMatchObject(
      metConditionResultWithTestNextState,
    );

    expect(baseOrChoiceRule.getSimulatedTestResult(booleanInputBothIncorrect)).toMatchObject(
      didNotMeetConditionResultWithNoState,
    );
  });

  it('should properly process not', () => {
    expect(baseNotChoiceRule.getSimulatedTestResult(booleanInputBothTrue)).toMatchObject(
      metConditionResultWithTestNextState,
    );

    expect(baseNotChoiceRule.getSimulatedTestResult(booleanInputCorrect)).toMatchObject(
      didNotMeetConditionResultWithNoState,
    );
  });
  // TODO test other booleans
});

describe('comparisonTypes', () => {
  // TODO this was not a great idea
  //  At the very least the keys should probably be the static functions themselves
  Object.keys(startingTestValues).forEach((ruleKey: string): void => {
    describe(`${ruleKey} - ${startingTestValues[ruleKey]}`, () => {
      const testChoiceRule = ChoiceRule[ruleKey](startingTestValues[ruleKey], `$.${ruleKey}`);

      it(`should properly process true input - ${correctTestInput[ruleKey]}`, () => {
        expect(testChoiceRule.getSimulatedTestResult(correctTestInput))
          .toMatchObject(metConditionResultWithNoState);
      });

      it(`should properly process false input - ${incorrectTestInput[ruleKey]}`, () => {
        expect(testChoiceRule.getSimulatedTestResult(incorrectTestInput))
          .toMatchObject(didNotMeetConditionResultWithNoState);
      });

      if (Object.prototype.hasOwnProperty.call(supplementaryCorrectTestInput, ruleKey)) {
        it(`should properly process supplementary (<= / >=) true input - ${supplementaryCorrectTestInput[ruleKey]}`, () => {
          expect(
            testChoiceRule.getSimulatedTestResult(supplementaryCorrectTestInput),
          ).toMatchObject(metConditionResultWithNoState);
        });
      }
    });
  });
});
