export default interface JsonStateMachineCompilationInterface {
  json: Json;
  validation: {
    passed: boolean;
    errors: string[];
  };
}
