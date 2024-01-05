import Ajv, { AnySchemaObject } from 'ajv';

export function validateApiResponse(
  responseBody: Response,
  expectedSchema: AnySchemaObject
) {
  const ajv = new Ajv({ allErrors: true, strict: false });
  const validate = ajv.compile(expectedSchema);
  const isValid = validate(responseBody);

  return {
    isValid,
    errors: validate.errors,
  };
}
