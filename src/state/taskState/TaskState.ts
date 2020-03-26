import State from '../State';
import TaskStateJsonInterface from './TaskStateJsonInterface';
import ResourceInterface from './ResourceInterface';
import NextableState from '../NextableState';
import validateField from '../../validateField';

export default class TaskState extends NextableState {
  constructor(
    name: string,
    private resource: ResourceInterface,
    next: State,
    comment?: string,
  ) {
    super('Task', name, next, comment);
    validateField(
      resource.uri,
      {
        errorMessage: `Unexpected ARN format '${resource.uri}' in Task state ${name}`,
        test: (resourceUri) => !!resourceUri.match(/arn(:[A-Za-z0-9_-]+){6}/),
      },
      true,
    );
  }

  getNextState = (): State => this.next;

  getJsonObject = (): TaskStateJsonInterface => ({
    ...super.getJsonObject(),
    Resource: this.resource.uri,
  });

  getSimulationOutputJsonObject = (input?: Json): Json => this.resource.mock(input);
}
