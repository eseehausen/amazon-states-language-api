interface SimulationOutputInterface {
  input: Json;
  output: Json;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  stateJsonObject: Record<string, any>; // TODO think of a better way to bring this in
}

type StateOutputGeneratorFunction = (input) => Generator<SimulationOutputInterface>;
