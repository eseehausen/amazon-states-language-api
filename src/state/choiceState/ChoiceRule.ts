import State from '../State';
import validateField from '../../validateField';
import ChoiceRuleComparisonJsonInterface from './ChoiceRuleComparisonJsonInterface';
import ChoiceRuleBooleanJsonInterface from './ChoiceRuleBooleanJsonInterface';
import ChoiceRuleBaseJsonInterface from './ChoiceRuleBaseJsonInterface';
import ChoiceRuleSimulatedTestResultInterface from './ChoiceRuleSimulatedTestResultInterface';

type ChoiceRuleConditionCheckFunction = (variable: Json) => boolean;

enum ChoiceRuleComparisonType {
  boolean,
  comparison,
}

enum ChoiceRuleTypeJsonKey {
  And = 'And',
  Or = 'Or',
  Not = 'Not',
  StringEquals = 'StringEquals',
  StringLessThan = 'StringLessThan',
  StringGreaterThan = 'StringGreaterThan',
  StringLessThanEquals = 'StringLessThanEquals',
  StringGreaterThanEquals = 'StringGreaterThanEquals',
  NumericEquals = 'NumericEquals',
  NumericLessThan = 'NumericLessThan',
  NumericGreaterThan = 'NumericGreaterThan',
  NumericLessThanEquals = 'NumericLessThanEquals',
  NumericGreaterThanEquals = 'NumericGreaterThanEquals',
  BooleanEquals = 'BooleanEquals',
  TimestampEquals = 'TimestampEquals',
  TimestampLessThan = 'TimestampLessThan',
  TimestampGreaterThan = 'TimestampGreaterThan',
  TimestampLessThanEquals = 'TimestampLessThanEquals',
  TimestampGreaterThanEquals = 'TimestampGreaterThanEquals',
}

export default class ChoiceRule {
  protected constructor(
    private type: ChoiceRuleComparisonType,
    private typeJsonKey: ChoiceRuleTypeJsonKey,
    protected meetsCondition: ChoiceRuleConditionCheckFunction,
    private readonly compared: string | boolean | number | ChoiceRule | ChoiceRule[],
    private readonly variablePath: string = '$',
    private readonly nextState?: State | null,
  ) {
    if (nextState === undefined) {
      this.nextState = null;
    }

    if (type === ChoiceRuleComparisonType.comparison) {
      validateField(
        variablePath,
        {
          errorMessage: `VariablePath ${variablePath} is not in ReferencePath format.`,
          test: (variablePathValue: string) => /\$(.([A-Za-z0-9_-]+))*/.test(variablePathValue),
        },
        true,
      );
    }
  }

  getBaseJsonObject = (): ChoiceRuleBaseJsonInterface &
    (ChoiceRuleComparisonJsonInterface | ChoiceRuleBooleanJsonInterface) => {
    if (this.nextState === null) {
      throw new Error('Base ChoiceRule incorrectly assigned without next state.');
    }

    return this.getJsonObject() as ChoiceRuleBaseJsonInterface &
      (ChoiceRuleComparisonJsonInterface | ChoiceRuleBooleanJsonInterface);
  };

  getJsonObject = (): ChoiceRuleComparisonJsonInterface|ChoiceRuleBooleanJsonInterface => {
    let comparedJsonObject;
    if (this.compared instanceof Array) {
      comparedJsonObject = this.compared.map((nestedRule) => nestedRule.getJsonObject());
    } else if (this.compared instanceof ChoiceRule) {
      comparedJsonObject = this.compared.getJsonObject();
    } else {
      comparedJsonObject = this.compared;
    }

    return {
      [this.typeJsonKey]: comparedJsonObject,
      ...(this.nextState ? { Next: this.nextState.getName() } : {}),
      ...(this.type === ChoiceRuleComparisonType.comparison ? { Variable: this.variablePath } : {}),
    };
  };

  private extractVariableFromInput = (input: Json): Json => this.tracePath(
    input, /(?:.([A-Za-z0-9_-]+))/g, this.variablePath.slice(0),
  );

  private tracePath = (input: Json, fieldRegex: RegExp, variablePath: string): Json => {
    // naive implementation - replace with library
    const match = fieldRegex.exec(variablePath);
    const matchFound = match !== null;

    if (matchFound && !Object.prototype.hasOwnProperty.call(input, match[1])) {
      throw new Error(`Invalid match ${match[1]} in ReferencePath ${this.variablePath}.`);
    }

    return matchFound ? this.tracePath(input[match[1]], fieldRegex, variablePath) : input;
  };

  public getSimulatedTestResult = (input: Json): ChoiceRuleSimulatedTestResultInterface => {
    const variable = this.type === ChoiceRuleComparisonType.boolean
      ? input : this.extractVariableFromInput(input);

    const metCondition = this.meetsCondition(variable);

    return {
      metCondition,
      nextState: metCondition ? this.nextState : null,
    };
  };

  static createBaseChoiceRule = (
    choiceRule: ChoiceRule, nextState: State,
  ): ChoiceRule => new ChoiceRule(
    choiceRule.type,
    choiceRule.typeJsonKey,
    choiceRule.meetsCondition,
    choiceRule.compared,
    choiceRule.variablePath,
    nextState,
  );

  static and = (nestedRules: ChoiceRule[]): ChoiceRule => new ChoiceRule(
    ChoiceRuleComparisonType.boolean,
    ChoiceRuleTypeJsonKey.And,
    (input: Json): boolean => nestedRules.reduce(
      (
        conditionMet: boolean, subRule,
      ) => subRule.getSimulatedTestResult(input).metCondition && conditionMet,
      true,
    ),
    nestedRules,
  );

  static or = (nestedRules: ChoiceRule[]): ChoiceRule => new ChoiceRule(
    ChoiceRuleComparisonType.boolean,
    ChoiceRuleTypeJsonKey.Or,
    (input: Json): boolean => nestedRules.reduce(
      (conditionMet: boolean, subRule) => (
        subRule.getSimulatedTestResult(input).metCondition || conditionMet
      ),
      false,
    ),
    nestedRules,
  );

  static not = (nestedRule: ChoiceRule): ChoiceRule => new ChoiceRule(
    ChoiceRuleComparisonType.boolean,
    ChoiceRuleTypeJsonKey.Not,
    (input: Json): boolean => !nestedRule.getSimulatedTestResult(input).metCondition,
    nestedRule,
  );

  private static equals = (
    typeJsonKey: ChoiceRuleTypeJsonKey, compared: string | number | boolean, variablePath: string,
  ): ChoiceRule => (
    new ChoiceRule(
      ChoiceRuleComparisonType.comparison,
      typeJsonKey,
      (input: string | number | boolean): boolean => input === compared,
      compared,
      variablePath,
    )
  );

  private static lessThan = (
    typeJsonKey: ChoiceRuleTypeJsonKey, compared: string | number, variablePath: string,
  ): ChoiceRule => (
    new ChoiceRule(
      ChoiceRuleComparisonType.comparison,
      typeJsonKey,
      (input: string | number): boolean => input < compared,
      compared,
      variablePath,
    )
  );

  private static greaterThan = (
    typeJsonKey: ChoiceRuleTypeJsonKey, compared: string | number, variablePath: string,
  ): ChoiceRule => (
    new ChoiceRule(
      ChoiceRuleComparisonType.comparison,
      typeJsonKey,
      (input: string | number): boolean => input > compared,
      compared,
      variablePath,
    )
  );

  private static lessThanEquals = (
    typeJsonKey: ChoiceRuleTypeJsonKey, compared: string | number, variablePath: string,
  ): ChoiceRule => (
    new ChoiceRule(
      ChoiceRuleComparisonType.comparison,
      typeJsonKey,
      (input: string | number): boolean => input <= compared,
      compared,
      variablePath,
    )
  );

  private static greaterThanEquals = (
    typeJsonKey: ChoiceRuleTypeJsonKey, compared: string | number, variablePath: string,
  ): ChoiceRule => (
    new ChoiceRule(
      ChoiceRuleComparisonType.comparison,
      typeJsonKey,
      (input: string | number): boolean => input >= compared,
      compared,
      variablePath,
    )
  );

  static booleanEquals = (compared: boolean, variablePath = '$'): ChoiceRule => (
    ChoiceRule.equals(ChoiceRuleTypeJsonKey.BooleanEquals, compared, variablePath)
  );

  static stringEquals = (
    compared: string, variablePath = '$',
  ): ChoiceRule => ChoiceRule.equals(
    ChoiceRuleTypeJsonKey.StringEquals, compared, variablePath,
  );

  static stringLessThan = (
    compared: string, variablePath = '$',
  ): ChoiceRule => ChoiceRule.lessThan(
    ChoiceRuleTypeJsonKey.StringLessThan, compared, variablePath,
  );

  static stringGreaterThan = (
    compared: string, variablePath = '$',
  ): ChoiceRule => ChoiceRule.greaterThan(
    ChoiceRuleTypeJsonKey.StringGreaterThan, compared, variablePath,
  );

  static stringLessThanEquals = (
    compared: string, variablePath = '$',
  ): ChoiceRule => ChoiceRule.lessThanEquals(
    ChoiceRuleTypeJsonKey.StringLessThanEquals, compared, variablePath,
  );

  static stringGreaterThanEquals = (
    compared: string, variablePath = '$',
  ): ChoiceRule => ChoiceRule.greaterThanEquals(
    ChoiceRuleTypeJsonKey.StringGreaterThanEquals, compared, variablePath,
  );

  static numericEquals = (
    compared: number, variablePath = '$',
  ): ChoiceRule => ChoiceRule.equals(
    ChoiceRuleTypeJsonKey.NumericEquals, compared, variablePath,
  );

  static numericLessThan = (
    compared: number, variablePath = '$',
  ): ChoiceRule => ChoiceRule.lessThan(
    ChoiceRuleTypeJsonKey.NumericLessThan, compared, variablePath,
  );

  static numericGreaterThan = (
    compared: number, variablePath = '$',
  ): ChoiceRule => ChoiceRule.greaterThan(
    ChoiceRuleTypeJsonKey.NumericGreaterThan, compared, variablePath,
  );

  static numericLessThanEquals = (
    compared: number, variablePath = '$',
  ): ChoiceRule => ChoiceRule.lessThanEquals(
    ChoiceRuleTypeJsonKey.NumericLessThanEquals, compared, variablePath,
  );

  static numericGreaterThanEquals = (
    compared: number, variablePath = '$',
  ): ChoiceRule => ChoiceRule.greaterThanEquals(
    ChoiceRuleTypeJsonKey.NumericGreaterThanEquals, compared, variablePath,
  );

  static timestampEquals = (
    compared: string, variablePath = '$',
  ): ChoiceRule => ChoiceRule.equals(
    ChoiceRuleTypeJsonKey.TimestampEquals, compared, variablePath,
  );

  static timestampLessThan = (
    compared: string, variablePath = '$',
  ): ChoiceRule => ChoiceRule.lessThan(
    ChoiceRuleTypeJsonKey.TimestampLessThan, compared, variablePath,
  );

  static timestampGreaterThan = (
    compared: string, variablePath = '$',
  ): ChoiceRule => ChoiceRule.greaterThan(
    ChoiceRuleTypeJsonKey.TimestampGreaterThan, compared, variablePath,
  );

  static timestampLessThanEquals = (
    compared: string, variablePath = '$',
  ): ChoiceRule => ChoiceRule.lessThanEquals(
    ChoiceRuleTypeJsonKey.TimestampLessThanEquals, compared, variablePath,
  );

  static timestampGreaterThanEquals = (
    compared: string, variablePath = '$',
  ): ChoiceRule => ChoiceRule.greaterThanEquals(
    ChoiceRuleTypeJsonKey.TimestampGreaterThanEquals, compared, variablePath,
  );

  getNextState(): State|null {
    return this.nextState;
  }
}
