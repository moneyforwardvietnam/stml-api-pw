import { expect, test } from "@playwright/test";
import OfficeEndpoint from "../endpoints/office-endpoint";

test('Verify token - get office - status code', async () => {
  const instance = new OfficeEndpoint();
  const response = await instance.getOffice();
  expect(response.status()).toBe(200);
});
