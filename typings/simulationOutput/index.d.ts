interface SimulationOutputInterface {
  string: string;
  jsonObject: Json;
}

type StateOutputGeneratorFunction = (input) => Generator<SimulationOutputInterface>;
