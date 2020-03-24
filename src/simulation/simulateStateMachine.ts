import State from '../state/State';

export default function simulateStateMachine(
  stateMachineSimulationOutput: string,
  startingState: State,
  input: Json = {},
  // contextObject?: Record<string, any>, TODO
): string {
  const divider = '\n----------------------\n';
  const header = `${divider}STARTING STATE MACHINE${divider}\n`;
  const footer = `\n${divider}STATE MACHINE FINISHED${divider}\n`;

  let currentState = startingState;
  let currentInput = input;
  let output = `${header + stateMachineSimulationOutput}${divider}`;

  while (!currentState.isEndState()) {
    const currentOutput = currentState.getSimulationOutput(currentInput);
    currentInput = currentOutput.jsonObject;
    output += `\n${currentOutput.string}${divider}\n`;
    currentState = currentState.getNextState();
  }

  output += currentState.getSimulationOutputString(currentInput) + footer;

  return output;
}
