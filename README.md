# Amazon States Language API

## Installation

Simply clone the directory and run:
```
npm install
```

## Demo & Documentation
To run the demo:
```
npm run demo
```
Check out the `demo/demo.ts` file- the annotations there currently serve as documentation.

## Tests
Unit tests are stored in .spec.ts files in the same directory as the tested class.
Integration tests and some example types are stored in `tests/`.
The general strategy has been to test public interfaces only.
```
npm test
```

## Approach
For general reference, the [current state language documentation](https://docs.aws.amazon.com/step-functions/latest/dg/concepts-amazon-states-language.html) was occasionally referenced, but for the most part, I used [the spec](https://states-language.net/spec.html) and [the AWS statelint rules](https://github.com/awslabs/statelint/blob/master/data/StateMachine.j2119). Instead of wrapping the ruby statelint, I used [@wmfs/statelint](https://github.com/awslabs/statelint/blob/master/data/StateMachine.j2119) to have the compiler check its work.

## Future
This was a fun test project, and there's a lot more that could be done here. I am thinking about plugging this into a front-end visualizer to round things out. But [@aws-cdk/aws-stepfunctions](https://github.com/aws/aws-cdk/tree/master/packages/%40aws-cdk/aws-stepfunctions) is where the real action is at.