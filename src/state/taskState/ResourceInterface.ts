export default interface ResourceInterface {
  uri: string;
  mock: (input: Json) => Json;
}

export const EXAMPLE_URI = 'arn:partition:service:region:account:task_type:name';
