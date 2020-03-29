import validateField from './validateField';

describe('validationResult', () => {
  const testValidationFieldValue = 'test';
  it('should respond with pass and no errors when there are no issues', () => {
    expect(
      validateField(
        testValidationFieldValue,
        [
          {
            errorMessage: 'We should not see this.',
            test: (): boolean => true,
          },
        ],
        true,
      ),
    ).toMatchObject({
      pass: true,
      errors: [],
    });
  });


  const firstFailErrorMessage = 'Should see this.';
  const secondFailErrorMessage = 'And should see this.';
  const failTestSet = [
    {
      errorMessage: 'Also should not see this.',
      test: (fieldValue: string): boolean => (fieldValue === testValidationFieldValue),
    },
    {
      errorMessage: firstFailErrorMessage,
      test: (): boolean => false,
    },
    {
      errorMessage: secondFailErrorMessage,
      test: (fieldValue: string): boolean => (fieldValue === `${testValidationFieldValue}!`),
    },
  ];
  const expectedErrors = [firstFailErrorMessage, secondFailErrorMessage];


  it('should respond with fail and errors when there are issues', () => {
    expect(validateField(testValidationFieldValue, failTestSet, false)).toMatchObject({
      pass: false,
      errors: expectedErrors,
    });
  });

  it('should throw an error when there are issues and throwError is true', () => {
    const throwWrapped = (): void => {
      validateField(testValidationFieldValue, failTestSet, true);
    };
    expect(throwWrapped).toThrow(firstFailErrorMessage);
    expect(throwWrapped).toThrow(secondFailErrorMessage);
  });
});
