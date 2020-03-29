export default interface ChoiceRuleComparisonJsonInterface {
  Variable: string; // TODO ReferencePath type
  StringEquals?: string;
  StringLessThan?: string;
  StringGreaterThan?: string;
  StringLessThanEquals?: string;
  StringGreaterThanEquals?: string;
  NumericEquals?: number;
  NumericLessThan?: number;
  NumericGreaterThan?: number;
  NumericLessThanEquals?: number;
  NumericGreaterThanEquals?: number;
  BooleanEquals?: boolean;
  TimestampEquals?: string; // TODO timestamp type
  TimestampLessThan?: string;
  TimestampGreaterThan?: string;
  TimestampLessThanEquals?: string;
  TimestampGreaterThanEquals?: string;
  Next?: string;
}
