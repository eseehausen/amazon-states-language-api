import * as StateLint from '@wmfs/statelint';
import StateMachineJsonInterface from './stateMachine/StateMachineJsonInterface';
import JsonStateMachineCompilationInterface from './JsonStateMachineCompilationInterface';

export default function compileJsonStateMachine(
  stateMachineJsonObject: StateMachineJsonInterface,
): JsonStateMachineCompilationInterface {
  const validationResults = StateLint().validate(stateMachineJsonObject);
  const json = JSON.stringify(stateMachineJsonObject, null, ' ');
  return {
    json,
    validation: {
      passed: validationResults.length === 0,
      errors: validationResults,
    },
  };
}
