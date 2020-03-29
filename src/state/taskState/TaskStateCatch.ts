import State from '../State';
import TaskStateCatchJsonInterface from './TaskStateCatchJsonInterface';
import validateField from '../../validateField';


export default class TaskStateCatch {
  public static readonly CATCH_ALL_ERRORS = 'States.ALL';

  constructor(
    private errorEqualsSet: string[],
    private resultPath: string,
    private next: State,
  ) {
    State.validateReferencePath(resultPath, true);

    validateField(
      errorEqualsSet,
      {
        errorMessage: 'TaskStateCatches must have at least one errorEquals item.',
        test: (errorEqualsSetValue: string[]) => errorEqualsSetValue.length > 0,
      },
      true,
    );
  }

  catchesError = (/* errorData: Json */): boolean => (
    this.errorEqualsSet.includes(TaskStateCatch.CATCH_ALL_ERRORS)
  );

  getJsonObject = (): TaskStateCatchJsonInterface => ({
    ErrorEquals: this.errorEqualsSet,
    ResultPath: this.resultPath,
    Next: this.next.getName(),
  });

  getNextState = (/* errorData: Json */): State => this.next;

  getOutputJson = (errorData: Json): Json => State.tracePath(errorData, this.resultPath.slice(0));
}
