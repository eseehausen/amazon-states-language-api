import State from '../State';

export default interface ChoiceRuleSimulatedTestResultInterface {
  metCondition: boolean;
  nextState: State | null;
}
