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
    const footer = `${divider}STATE MACHINE FINISHED${divider}`;
    const outputGenerator = stateOutputGeneratorFunction(input);
    const statesOutputString = Array.from(outputGenerator).reduce(
      (
        outputString: string, output: SimulationOutputInterface,
      ) => `${outputString}\n${divider}
${JSON.stringify(output.stateJsonObject)}

Input:
${JSON.stringify(output.input)}

Output:
${JSON.stringify(output.output)}
`, '',
    );

    return `${header}\n${stateMachineSimulationOutputString}${statesOutputString}${footer}`;
  };
}
