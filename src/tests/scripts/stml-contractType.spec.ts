import { expect, test } from "@playwright/test";
import { CONTRACT_TYPES_ERROR_WrongTennantUserID } from "../resources/schema/contractTypes.schema";
import contractTypesEnpoint from "../endpoints/contract_types";
import { validateApiResponse } from "../../utils/validation";


test.describe.configure({ mode: 'default' });
test('@Test1: Status code 401 - GetContractType (application templates) - Wrong Tennant UserID', async () => {
    const instance = new contractTypesEnpoint();
    const header = { 'X-Email': "ly.hong.phat@moneyforward.co.jp" }
    const response = await instance.getContractTypes(header);
    const responseBody = await response.json()
    expect(response.status()).toBe(401);
    validateApiResponse(responseBody, CONTRACT_TYPES_ERROR_WrongTennantUserID);
});
