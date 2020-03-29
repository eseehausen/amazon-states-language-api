import State from '../State';
import TaskStateJsonInterface from './TaskStateJsonInterface';
import ResourceInterface from './ResourceInterface';
import NextableState from '../NextableState';
import validateField from '../../validateField';
import TaskStateCatch from './TaskStateCatch';

interface MockResponseResultInterface {
  nextState: State;
  outputJsonObject: Json;
}

export default class TaskState extends NextableState {
  private taskStateCatches: TaskStateCatch[] = [];

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
        test: (resourceUri) => !!resourceUri.match(/arn(:[A-Za-z0-9_/-]+){6,}/),
      },
      true,
    );
  }

  protected getJsonObject = (): TaskStateJsonInterface => {
    const catchJsonObject = this.taskStateCatches.length > 0 ? {
      Catch: this.taskStateCatches.map(
        (taskStateCatch) => taskStateCatch.getJsonObject(),
      ),
    } : {};

    return {
      ...super.getJsonObject(),
      Resource: this.resource.uri,
      ...catchJsonObject,
    };
  };

  addCatch = (taskStateCatch: TaskStateCatch): this => {
    this.taskStateCatches.push(taskStateCatch);
    return this;
  };

  private responseHasAnError = (resourceResponse): boolean => Object.prototype.hasOwnProperty.call(
    resourceResponse, 'errorType',
  );

  private getRelevantCatch(): TaskStateCatch {
    const relevantCatch = this.taskStateCatches.find(
      (taskStateCatch) => taskStateCatch.catchesError(),
      // will take input down the line
    );

    if (relevantCatch === undefined) {
      throw new Error('No relevant catch found for resource error.');
    }

    return relevantCatch;
  }

  private responseResult: MockResponseResultInterface = undefined;

  private getResponseResult = (input: Json): MockResponseResultInterface => {
    if (this.responseResult !== undefined) {
      // TODO caching this isn't great- a broader indication that
      //  the getNextState and getSimulationOutputJsonObject methods
      //  should probably be merged into a single interface across the board
      return this.responseResult;
    }

    const resourceResponse = this.resource.mock(input);

    let responseResult: MockResponseResultInterface;

    if (this.responseHasAnError(resourceResponse)) {
      // super naive simulation here - this is how we're determining if a mock has an error
      // here's a better guide:
      // https://docs.aws.amazon.com/apigateway/latest/developerguide/handle-errors-in-lambda-integration.html
      const relevantTaskStateCatch = this.getRelevantCatch();

      responseResult = {
        nextState: relevantTaskStateCatch.getNextState(),
        outputJsonObject: relevantTaskStateCatch.getOutputJson(resourceResponse),
      };
    } else {
      responseResult = {
        nextState: this.next,
        outputJsonObject: resourceResponse,
      };
    }
    this.responseResult = responseResult;
    return responseResult;
  };

  protected getPossibleNextStates(): (State | null)[] {
    return [
      this.next,
      ...this.taskStateCatches.map((taskStateCatch) => taskStateCatch.getNextState()),
    ];
  }

  getNextState = (input: Json): State => this.getResponseResult(input).nextState;

  protected getSimulationOutputJsonObject = (input?: Json): Json => (
    this.getResponseResult(input).outputJsonObject
  );
}
