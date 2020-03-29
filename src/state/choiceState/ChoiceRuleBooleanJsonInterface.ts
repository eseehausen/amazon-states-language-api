import ChoiceRuleComparisonJsonInterface from './ChoiceRuleComparisonJsonInterface';

export default interface ChoiceRuleBooleanJsonInterface {
  And?: [ChoiceRuleBooleanJsonInterface | ChoiceRuleComparisonJsonInterface];
  Or?: [ChoiceRuleBooleanJsonInterface | ChoiceRuleComparisonJsonInterface];
  Not?: [ChoiceRuleBooleanJsonInterface | ChoiceRuleComparisonJsonInterface];
  Next?: string;
}
