import * as StateLint from '@wmfs/statelint';
import StateMachineJsonInterface from './StateMachine/StateMachineJsonInterface';

export default function compileJsonStateMachine(stateMachineJsonObject: StateMachineJsonInterface):
  {
    json: string;
    validation?: {
      passed: boolean;
      errors: string[];
    };
  } {
  const validationResults = StateLint().validate(stateMachineJsonObject);
  const json = JSON.stringify(stateMachineJsonObject);
  return {
    json,
    validation: {
      passed: validationResults.length === 0,
      errors: validationResults,
    },
  };
}
