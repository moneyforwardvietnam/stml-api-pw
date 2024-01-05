import { expect, test } from "@playwright/test";
import BillingsEndpoint from "../endpoints/billings-endpoint";


test('Get billings - status code', async () => {
  const instance = new BillingsEndpoint();
  const response = await instance.getBillings();
  expect(response.status()).toBe(200);
});
   