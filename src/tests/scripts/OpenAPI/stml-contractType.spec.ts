import { expect, test } from "@playwright/test";
import * as contractTypesSchema from "../../resources/schema/contract-types.schema";
import { DataTest } from "../../resources/data/data";
import ContractTypesEndpoint from "../../endpoints/contract-types.endpoints"
import { expectResponse, validateApiResponse } from "../../../utils/validation";
import { HttpMethod } from "../../../utils/request/http-method";

// This command to trigger the test in order
test.describe.configure({ mode: 'default' });
test.describe("@OpenAPI, @FunctionalTest: GET - ContractTypes 契約種別 (application_template)", { tag: "@GET-ContractTypes" }, () => {
    test("@GET-ContractTypes: [C151148] Status code 403 - GetContractType (application templates) - Insufficient office plan", async () => {
        const instance = new ContractTypesEndpoint();
        const header = { 'X-Email': process.env.EMAIL_1 }
        const response = await instance.getContractTypes(header, 'INVALID');
        const responseBody = await response.json()
        expect(response.status()).toBe(403);
        validateApiResponse(responseBody, contractTypesSchema.CONTRACT_TYPES_ERROR_InsufficientOfficePlan);
    });

    test("C151149: Status code 401 - GetContractType (application templates) - Invalid X-Token", async () => {
        const instance = new ContractTypesEndpoint();
        const header = { 'X-Email': DataTest.INVALID_TOKEN }
        const response = await instance.getContractTypes(header, '0');
        const responseBody = await response.json()
        expect(response.status()).toBe(401);
        validateApiResponse(responseBody, contractTypesSchema.CONTRACT_TYPE_ERROR_InvalidXToken);
        const expectedErrorInvalidXToken = {
            type: "TYPE_UNAUTHORIZED",
            code: "CODE_INTERNAL_PARTNER_UNAUTHORIZED",
            message: "access token is not active",
            param: false
        }
        await expectResponse(responseBody.errors[0], expectedErrorInvalidXToken)
    });


    test("C152218: Status code 401 - GetContractType (application templates) - Invalid X-Email", async () => {
        const instance = new ContractTypesEndpoint();
        const header = { 'X-Email': DataTest.INVALID_EMAIL }
        const response = await instance.getContractTypes(header, '0');
        const responseBody = await response.json()
        expect(response.status()).toBe(401);
        validateApiResponse(responseBody, contractTypesSchema.CONTRACT_TYPE_ERROR_InvalidXEmail);
        const expectedErrorInvalidXEmail = {
            type: "TYPE_UNAUTHORIZED",
            code: "CODE_INTERNAL_PARTNER_UNAUTHORIZED",
            message: "invalid email address",
            param: DataTest.INVALID_EMAIL
        }
        await expectResponse(responseBody.errors[0], expectedErrorInvalidXEmail)

    });

    test("C152219: Status code 401 - GetContractType (application templates) - Unauthenticated", async () => {
        const instance = new ContractTypesEndpoint();
        const header = { 'X-Email': DataTest.UNAUTHENTICATED_EMAIL }
        const response = await instance.getContractTypes(header, '0');
        const responseBody = await response.json()
        expect(response.status()).toBe(401);
        validateApiResponse(responseBody, contractTypesSchema.CONTRACT_TYPE_ERROR_Unauthenticated);
        const expectedErrorUnauthenticated = {
            type: "TYPE_UNAUTHORIZED",
            code: "CODE_INTERNAL_PARTNER_UNAUTHORIZED",
            message: "get mfid user by email",
            param: DataTest.UNAUTHENTICATED_EMAIL
        }
        await expectResponse(responseBody.errors[0], expectedErrorUnauthenticated)

    });

    test("C152220: Status code 401 - GetContractType (application templates) - Wrong Tennant", async () => {
        const instance = new ContractTypesEndpoint();
        const header = { 'X-Email': DataTest.WRONGTENANTUSER_EMAIL }
        const response = await instance.getContractTypes(header, '0');
        const responseBody = await response.json()
        expect(response.status()).toBe(401);
        validateApiResponse(responseBody, contractTypesSchema.CONTRACT_TYPES_ERROR_WrongTennant);
        const expectedErrorWrongTennantUserID = {
            type: "TYPE_UNAUTHORIZED",
            code: "CODE_INTERNAL_PARTNER_UNAUTHORIZED",
            message: "get active user by mfid user id in office"
        }
        await expectResponse(responseBody.errors[0], expectedErrorWrongTennantUserID)
    });

    test("C152221: Status code 403 - GetContractType (application templates) - Unauthorized", async () => {
        const instance = new ContractTypesEndpoint();
        const header = { 'X-Email': DataTest.UNAUTHORIZED_EMAIL }
        const response = await instance.getContractTypes(header, '0');
        const responseBody = await response.json()
        expect(response.status()).toBe(403);
        validateApiResponse(responseBody, contractTypesSchema.CONTRACT_TYPE_ERROR_Unauthorized);
        const expectedErrorUnauthorized = {
            type: "TYPE_FORBIDDEN",
            code: "CODE_USER_INSUFFICIENT_AUTHORIZATION",
            message: "user is not authorized to use the service"
        }
        await expectResponse(responseBody.errors[0], expectedErrorUnauthorized)
    });


    test("C152222: Status code 404 - GetContractType (application templates) - Insufficient methods", async () => {
        const instance = new ContractTypesEndpoint();
        const invalidMethods = [
            HttpMethod.DELETE,
            HttpMethod.POST,
            HttpMethod.PUT,
            HttpMethod.PATCH,
            HttpMethod.HEAD,
            HttpMethod.OPTIONS
        ];
        for (let invalidMethod of invalidMethods) {
            console.log(invalidMethod)
            const response = await instance.requestMethodsContracTypes(invalidMethod, '0');
            expect(response.status()).toBe(404);
        }
    });


    test("C152223: Status code 200 - GetContractType (application templates) - Success", async () => {
        const instance = new ContractTypesEndpoint();
        const header = { 'X-Email': DataTest.VALID_EMAIL }
        const response = await instance.getContractTypes(header, '0');
        const responseBody = await response.json()
        expect(response.status()).toBe(200);
        validateApiResponse(responseBody, contractTypesSchema.CONTRACT_TYPE_SUCCESS);
        const expectedSuccess = {
            id: "AOqMpDlByNza059kmQdx8VE3",
            name: "契約種別なし",
            description: "",
            is_default: true
        }
        await expectResponse(responseBody.data[0], expectedSuccess);
    });





});


