interface ValidationResultInterface {
  pass: boolean;
  errors: string[];
}

interface ValidationConditionInterface<T> {
  errorMessage: string;
  test: (fieldValue: T) => boolean;
}

export default function validateField<T>(
  fieldValue: T,
  validationConditions: ValidationConditionInterface<T>[] | ValidationConditionInterface<T>,
  throwErrorOnFailure = false,
): ValidationResultInterface {
  const testedValidationConditions = Array.isArray(validationConditions)
    ? validationConditions : [validationConditions];
  const validationResult = testedValidationConditions.reduce(
    (
      result: ValidationResultInterface,
      condition: ValidationConditionInterface<T>,
    ) => {
      const pass = condition.test(fieldValue);
      return {
        pass: pass ? result.pass : false,
        errors: pass ? [...result.errors]
          : [...result.errors, condition.errorMessage],
      };
    }, {
      pass: true,
      errors: [],
    },
  );
  if (throwErrorOnFailure && !validationResult.pass) {
    throw Error(validationResult.errors.join('\n'));
  }
  return validationResult;
}
