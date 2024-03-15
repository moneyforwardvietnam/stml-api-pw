import Ajv, {AnySchemaObject} from 'ajv';
import {expect} from 'playwright/test';
import {Logger} from './logger';

export function validateApiResponse(
  responseBody: Response,
  expectedSchema: AnySchemaObject
) {
  const ajv = new Ajv({ allErrors: true, strict: false });
  const validate = ajv.compile(expectedSchema);
  const isValid = validate(responseBody);

  Logger.info("validate the JSON schema");
  if (!isValid){
    Logger.error(ajv.errorsText(validate.errors));
  }
  expect(isValid).toBeTruthy();

  return {
    isValid,
    errors: validate.errors,
  };

}

export async function expectResponse(
  responseBody: any,
  expectedData: any) {
  for (let key in expectedData) {
    if (expectedData.hasOwnProperty(key)) {
      let expected = expectedData[key];
      let value = responseBody[key];
      let message: string = `${key} expected as ${expected}`
      Logger.info(message);
      expect(value).toBe(expected);
    }
  }
}