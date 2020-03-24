import StatesJsonInterface from './StatesJsonInterface';

export default interface StateMachineJsonInterface {
  Comment?: string;
  StartAt: string;
  States: StatesJsonInterface;
  Version?: string; // not required by spec, even if we always have it
  TimeoutSeconds?: number;
}
