import { expect, test } from "@playwright/test";
import { CONTRACT_TYPES_ERROR_InsufficientOfficePlan, CONTRACT_TYPES_ERROR_WrongTennantUserID, CONTRACT_TYPE_ERROR_Unauthenticated, CONTRACT_TYPE_ERROR_InvalidXEmail, CONTRACT_TYPE_ERROR_Unauthorized, CONTRACT_TYPE_SUCCESS_ShowList } from "../resources/schema/contractTypes.schema";
// import * as contractTypes.schema from "../resources/schema/contractTypes.schema";
import contractTypesEnpoint from "../endpoints/contract_types";
import { expectResponse, validateApiResponse } from "../../utils/validation";
import { verify } from "crypto";


test.describe.configure({ mode: 'default' });
test('@CT01: Status code 403 - GetContractType (application templates) - Insufficient office plan', async () => {
    const instance = new contractTypesEnpoint();
    const header = { 'X-Email': "ly.hong.phat@moneyforward.co.jp" }
    const response = await instance.getContractTypes(header);
    const responseBody = await response.json()
    expect(response.status()).toBe(403);
    validateApiResponse(responseBody, CONTRACT_TYPES_ERROR_InsufficientOfficePlan);
});


test('@CT02: Status code 401 - GetContractType (application templates) - Invalid X-Email', async () => {
    const instance = new contractTypesEnpoint();
    const header = { 'X-Email': "ly.hong.phat@moneyforward.co.vn" }
    const response = await instance.getContractTypes(header);
    const responseBody = await response.json()
    expect(response.status()).toBe(401);
    validateApiResponse(responseBody, CONTRACT_TYPE_ERROR_InvalidXEmail);
    const expectedErrorInvalidXEmail = {
        type: "TYPE_UNAUTHORIZED",
        code: "CODE_INTERNAL_PARTNER_UNAUTHORIZED",
        message: "get mfid user by email",
        param: "ly.hong.phat@moneyforward.co.vn"
    }
    await expectResponse(responseBody, expectedErrorInvalidXEmail)

});


test('@CT03: Status code 401 - GetContractType (application templates) - Unauthenticated', async () => {
    const instance = new contractTypesEnpoint();
    const header = { 'X-Email': "ly.hong.phat+1333@moneyforward.vn" }
    const response = await instance.getContractTypes(header);
    const responseBody = await response.json()
    expect(response.status()).toBe(401);
    validateApiResponse(responseBody, CONTRACT_TYPE_ERROR_Unauthenticated);
    const expectedErrorUnauthenticated = {
        type: "TYPE_UNAUTHORIZED",
        code: "CODE_INTERNAL_PARTNER_UNAUTHORIZED",
        message: "get mfid user by email",
        param: "ly.hong.phat+1333@moneyforward.vn"
    }
    await expectResponse(responseBody, expectedErrorUnauthenticated )

});

test('@CT04: Status code 401 - GetContractType (application templates) - Wrong Tennant UserID', async () => {
    const instance = new contractTypesEnpoint();
    const header = { 'X-Email': "ly.hong.phat@moneyforward.co.jp" }
    const response = await instance.getContractTypes(header);
    const responseBody = await response.json()
    expect(response.status()).toBe(401);
    validateApiResponse(responseBody, CONTRACT_TYPES_ERROR_WrongTennantUserID);
    const expectedErrorWrongTennantUserID = {
        type: "TYPE_UNAUTHORIZED",
        code: "CODE_INTERNAL_PARTNER_UNAUTHORIZED",
        message: "get mfid user by email"
    }
    await expectResponse(responseBody, expectedErrorWrongTennantUserID)
});

test('@CT05: Status code 403 - GetContractType (application templates) - Unauthorized', async () => {
    const instance = new contractTypesEnpoint();
    const header = { 'X-Email': "ly.hong.phat+111@moneyforward.vn" }
    const response = await instance.getContractTypes(header);
    const responseBody = await response.json()
    expect(response.status()).toBe(403);
    validateApiResponse(responseBody, CONTRACT_TYPE_ERROR_Unauthorized);
    const expectedErrorUnauthorized = {
        type: "TYPE_FORBIDDEN",
        code: "CODE_USER_INSUFFICIENT_AUTHORIZATION",
        message: "user is not authorized to use the service"
    }
    await expectResponse(responseBody, expectedErrorUnauthorized)
});

test('@CT06: Status code 200 - GetContractType (application templates) - Success', async () => {
    const instance = new contractTypesEnpoint();
    const header = { 'X-Email': "ly.hong.phat@moneyforward.vn" }
    const response = await instance.getContractTypes(header);
    const responseBody = await response.json()
    expect(response.status()).toBe(200);
    validateApiResponse(responseBody, CONTRACT_TYPE_SUCCESS_ShowList);
});







