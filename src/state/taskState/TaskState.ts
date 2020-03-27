import State from '../State';
import TaskStateJsonInterface from './TaskStateJsonInterface';
import ResourceInterface from './ResourceInterface';
import NextableState from '../NextableState';
import validateField from '../../validateField';

export default class TaskState extends NextableState {
  constructor(
    name: string,
    private resource: ResourceInterface,
    next?: State | null,
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

  protected getNextState = (): State => this.next;

  protected checkForNext = (): void => {
    if (this.next === null) {
      throw new Error(
        `Task ${this.getName()} must have a next state assigned before compilation/simulation.`,
      );
    }
  };

  protected getJsonObject = (): TaskStateJsonInterface => {
    this.checkForNext();
    return {
      ...super.getJsonObject(),
      Resource: this.resource.uri,
    };
  };

  protected getSimulationOutputJsonObject = (input?: Json): Json => {
    this.checkForNext();
    return this.resource.mock(input);
  };
}
