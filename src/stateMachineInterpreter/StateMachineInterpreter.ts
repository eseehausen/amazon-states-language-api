
export default class StateMachineInterpreter {
  static readonly DIVIDER = '\n----------------------\n';

  static readonly SIMULATION_JSON_SPACER = '  ';

  static simulateStateMachine = (
    stateMachineSimulationOutputString: string,
    stateOutputGeneratorFunction: StateOutputGeneratorFunction,
    input: Json = {},
    timeoutSeconds?: number,
    // contextObject?: Record<string, any>, TODO
  ): string => {
    const { DIVIDER, SIMULATION_JSON_SPACER } = StateMachineInterpreter;

    const startDate = new Date();

    const header = `${DIVIDER}STARTING STATE MACHINE\nTimestamp: ${startDate.toJSON()}${DIVIDER}`;
    const footerStart = `${DIVIDER}STATE MACHINE FINISHED`;

    const outputGenerator = stateOutputGeneratorFunction(input);

    const statesOutputInformation = Array.from(outputGenerator).reduce(
      (
        outputInformation: { string: string; secondsElapsed: number },
        output: SimulationOutputInterface,
      ) => {
        const newSecondsElapsed = outputInformation.secondsElapsed + (
          output.stateJsonObject.Seconds !== undefined ? output.stateJsonObject.Seconds : 0
        );

        if (timeoutSeconds !== undefined && newSecondsElapsed > timeoutSeconds) {
          throw new Error('State machine timed out.');
        }

        const newOutputString = `${outputInformation.string}
${DIVIDER}
${JSON.stringify(output.stateJsonObject, null, SIMULATION_JSON_SPACER)}

Input:
${JSON.stringify(output.input, null, SIMULATION_JSON_SPACER)}

Output:
${JSON.stringify(output.output, null, SIMULATION_JSON_SPACER)}

Timestamp:
${(new Date(startDate.getTime() + newSecondsElapsed * 1000)).toJSON()}
`;
        // currently timestamp only progresses with wait states

        return {
          string: newOutputString,
          secondsElapsed: newSecondsElapsed,
        };
      },
      { string: '', secondsElapsed: 0 },
    );

    return `${header}
${stateMachineSimulationOutputString}
${statesOutputInformation.string}${footerStart}
Timestamp: ${(new Date(startDate.getTime() + statesOutputInformation.secondsElapsed * 1000)).toJSON()}
Simulated Seconds Delayed: ${statesOutputInformation.secondsElapsed}${DIVIDER}`;
  };
}
