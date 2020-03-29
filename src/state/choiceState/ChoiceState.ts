import State from '../State';
import ChoiceStateJsonInterface from './ChoiceStateJsonInterface';
import ChoiceRule from './ChoiceRule';
import ChoiceRuleSimulatedTestResultInterface from './ChoiceRuleSimulatedTestResultInterface';

export default class ChoiceState extends State {
  private choiceRules: ChoiceRule[] = [];

  constructor(
    name: string,
    comment?: string,
    private defaultNextState: State = null,
  ) {
    super('Choice', name, comment);
  }

  protected isEndState = (): boolean => false; // TODO check if this is necessarily true

  protected getJsonObject = (): ChoiceStateJsonInterface => {
    const choiceJsonObjects = this.choiceRules.map(
      (choiceRule: ChoiceRule) => choiceRule.getBaseJsonObject(),
    );

    return {
      ...super.getJsonObject(),
      Choices: choiceJsonObjects,
      ...(this.defaultNextState ? { Default: this.defaultNextState.getName() } : {}),
    };
  };

  protected getSuccessfulChoiceRuleSimulatedTestResult = (
    choiceRules: ChoiceRule[], input: Json,
  ): ChoiceRuleSimulatedTestResultInterface => {
    if (choiceRules.length > 0) {
      const simulatedTestResult = choiceRules[0].getSimulatedTestResult(input);
      return simulatedTestResult.metCondition ? simulatedTestResult
        : this.getSuccessfulChoiceRuleSimulatedTestResult(choiceRules.slice(1), input);
    }
    return {
      metCondition: false,
      nextState: null,
    };
  };

  protected getPossibleNextStates(): (State|null)[] {
    return [
      ...this.choiceRules.reduce((choiceRuleNextStates: State[], choiceRule: ChoiceRule) => [
        ...choiceRuleNextStates,
        choiceRule.getNextState(),
      ], []),
      ...(this.defaultNextState !== null ? [this.defaultNextState] : []),
    ];
  }

  protected getNextState = (input: Json): State|null => {
    // TODO check out if it's an error if a choice isn't found without a default
    //  also not a huge fan of this approach because of the double call
    //  also break out interface?
    const simulatedTestResult = this.getSuccessfulChoiceRuleSimulatedTestResult(
      this.choiceRules, input,
    );
    return simulatedTestResult.metCondition ? simulatedTestResult.nextState : this.defaultNextState;
  };

  protected getSimulationOutputJsonObject = (input?: Json): Json => input;

  addChoice = (choiceRule: ChoiceRule, next: State): this => {
    this.choiceRules.push(ChoiceRule.createBaseChoiceRule(choiceRule, next));
    return this;
  };
}
