import State from './State';
import TaskStateJsonInterface from './TaskStateJsonInterface';
import ResourceInterface from './ResourceInterface';

export default class TaskState extends State {
  constructor(
    name: string,
    private resource: ResourceInterface,
    comment?: string,
    next?: State,
  ) {
    super('Pass', name, comment, next);
    if (!resource.uri.match(/arn(:[A-Za-z0-9_-]+){6}/)) {
      throw new Error(`Unexpected ARN format in Task state ${name}`);
    }
  }

  isEndState = (): boolean => this.next === undefined;

  // needed for abstract constructor call
  // eslint-disable-next-line class-methods-use-this
  canHaveNextState(): boolean {
    return true;
  }

  getNextState = (): State|undefined => this.next;

  getJsonObject = (): TaskStateJsonInterface => ({
    ...this.getBaseJsonObject(true),
    Resource: this.resource.uri,
  });

  getSimulationOutputJsonObject = (input?: Json): Json => this.resource.mock(input);
}
