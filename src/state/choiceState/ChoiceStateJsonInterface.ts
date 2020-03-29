import StateJsonInterface from '../StateJsonInterface';
import ChoiceRuleBaseJsonInterface from './ChoiceRuleBaseJsonInterface';
import ChoiceRuleBooleanJsonInterface from './ChoiceRuleBooleanJsonInterface';
import ChoiceRuleComparisonJsonInterface from './ChoiceRuleComparisonJsonInterface';

// keeping this as a placeholder for further development
// probably will just get replaced with IOState
// eslint-disable-next-line
export default interface ChoiceStateJsonInterface extends StateJsonInterface {
  // InputPath?: string;
  // OutputPath?: string;
  Default?: string;
  Choices: (ChoiceRuleBaseJsonInterface &
    (ChoiceRuleBooleanJsonInterface|ChoiceRuleComparisonJsonInterface))[];
}
