import {expect, test} from "@playwright/test";
import * as contractTypes from "../resources/schema/contract-types.schema";
import {DataTest} from "../resources/data/data";
import ContractTypesEndpoint from "../endpoints/contract-types.endpoints"
import {expectResponse, validateApiResponse} from "../../utils/validation";

test.describe.configure({ mode: 'default' });
test('@CT01: Status code 403 - GetContractType (application templates) - Insufficient office plan', async () => {
    const instance = new ContractTypesEndpoint();
    const header = { 'X-Email': "ly.hong.phat@moneyforward.co.jp" }
    const response = await instance.getContractTypes(header, '1');
    const responseBody = await response.json()
    expect(response.status()).toBe(403);
    validateApiResponse(responseBody, contractTypes.CONTRACT_TYPES_ERROR_InsufficientOfficePlan);
});

test('@CT02: Status code 401 - GetContractType (application templates) - Invalid X-Email', async () => {
    const instance = new ContractTypesEndpoint();
    const header = { 'X-Email': DataTest.INVALID_EMAIL }
    const response = await instance.getContractTypes(header, '0');
    const responseBody = await response.json()
    expect(response.status()).toBe(401);
    validateApiResponse(responseBody, contractTypes.CONTRACT_TYPE_ERROR_InvalidXEmail);
    const expectedErrorInvalidXEmail = {
        type: "TYPE_UNAUTHORIZED",
        code: "CODE_INTERNAL_PARTNER_UNAUTHORIZED",
        message: "invalid email address",
        param: DataTest.INVALID_EMAIL
    }
    await expectResponse(responseBody.errors[0], expectedErrorInvalidXEmail)

});

test('@CT03: Status code 401 - GetContractType (application templates) - Unauthenticated', async () => {
    const instance = new ContractTypesEndpoint();
    const header = { 'X-Email': DataTest.UNAUTHENTICATED_EMAIL }
    const response = await instance.getContractTypes(header, '0');
    const responseBody = await response.json()
    expect(response.status()).toBe(401);
    validateApiResponse(responseBody, contractTypes.CONTRACT_TYPE_ERROR_Unauthenticated);
    const expectedErrorUnauthenticated = {
        type: "TYPE_UNAUTHORIZED",
        code: "CODE_INTERNAL_PARTNER_UNAUTHORIZED",
        message: "get mfid user by email",
        param: DataTest.UNAUTHENTICATED_EMAIL
    }
    await expectResponse(responseBody.errors[0], expectedErrorUnauthenticated)

});

test('@CT04: Status code 401 - GetContractType (application templates) - Wrong Tennant', async () => {
    const instance = new ContractTypesEndpoint();
    const header = { 'X-Email': DataTest.WRONGTENANTUSER_EMAIL }
    const response = await instance.getContractTypes(header, '0');
    const responseBody = await response.json()
    expect(response.status()).toBe(401);
    validateApiResponse(responseBody, contractTypes.CONTRACT_TYPES_ERROR_WrongTennant);
    const expectedErrorWrongTennantUserID = {
        type: "TYPE_UNAUTHORIZED",
        code: "CODE_INTERNAL_PARTNER_UNAUTHORIZED",
        message: "get active user by mfid user id in office"
    }
    await expectResponse(responseBody.errors[0], expectedErrorWrongTennantUserID)
});

test('@CT05: Status code 403 - GetContractType (application templates) - Unauthorized', async () => {
    const instance = new ContractTypesEndpoint();
    const header = { 'X-Email': DataTest.UNAUTHORIZED_EMAIL }
    const response = await instance.getContractTypes(header, '0');
    const responseBody = await response.json()
    expect(response.status()).toBe(403);
    validateApiResponse(responseBody, contractTypes.CONTRACT_TYPE_ERROR_Unauthorized);
    const expectedErrorUnauthorized = {
        type: "TYPE_FORBIDDEN",
        code: "CODE_USER_INSUFFICIENT_AUTHORIZATION",
        message: "user is not authorized to use the service"
    }
    await expectResponse(responseBody.errors[0], expectedErrorUnauthorized)
});

test('@CT06: Status code 200 - GetContractType (application templates) - Success', async () => {
    const instance = new ContractTypesEndpoint();
    const header = { 'X-Email': "ly.hong.phat@moneyforward.vn" }
    const response = await instance.getContractTypes(header, '0');
    const responseBody = await response.json()
    expect(response.status()).toBe(200);
    validateApiResponse(responseBody, contractTypes.CONTRACT_TYPE_SUCCESS_ShowList);
    const expectedSuccess = {
        id: "AOqMpDlByNza059kmQdx8VE3",
        name: "契約種別なし",
        description: "",
        is_default: true
    }
    await expectResponse(responseBody.data[0], expectedSuccess);
});








