import State from '../state/State';

export default function interpretStateMachine(
  stateMachineSimulationOutput: string,
  startingState: State,
  // contextObject?: Record<string, any>, TODO
): string {
  const header = `
----------------------
STARTING STATE MACHINE
----------------------

`;
  const footer = `
  
----------------------
STATE MACHINE FINISHED
----------------------`;

  let currentState = startingState;
  let output = `${header + stateMachineSimulationOutput}
----------------------
`;

  while (!currentState.isEndState()) {
    output += currentState.getSimulationOutputString();
    currentState = currentState.getNextState();
  }

  output += currentState.getSimulationOutputString() + footer;

  return output;
}
