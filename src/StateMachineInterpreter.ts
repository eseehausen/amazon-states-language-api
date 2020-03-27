
export default class StateMachineInterpreter {
  static readonly divider = '\n----------------------\n';

  static simulateStateMachine = (
    stateMachineSimulationOutputString: string,
    stateOutputGeneratorFunction: StateOutputGeneratorFunction,
    input: Json = {},
    // contextObject?: Record<string, any>, TODO
  ): string => {
    const { divider } = StateMachineInterpreter;
    const header = `${divider}STARTING STATE MACHINE${divider}`;
    const footerStart = `${divider}STATE MACHINE FINISHED`;
    const outputGenerator = stateOutputGeneratorFunction(input);
    const statesOutputInformation = Array.from(outputGenerator).reduce(
      (
        outputInformation: { string: string; secondsElapsed: number },
        output: SimulationOutputInterface,
      ) => {
        const newOutputString = `${outputInformation.string}
${divider}
${JSON.stringify(output.stateJsonObject)}

Input:
${JSON.stringify(output.input)}

Output:
${JSON.stringify(output.output)}
`;
        const newSecondsElapsed = outputInformation.secondsElapsed + (
          output.stateJsonObject.Seconds !== undefined ? output.stateJsonObject.Seconds : 0
        );
        return {
          string: newOutputString,
          secondsElapsed: newSecondsElapsed,
        };
      }, { string: '', secondsElapsed: 0 },
    );

    return `${header}\n${stateMachineSimulationOutputString}${statesOutputInformation.string}${footerStart}
Simulated Seconds Delayed: ${statesOutputInformation.secondsElapsed}
${divider}`;
  };
}
