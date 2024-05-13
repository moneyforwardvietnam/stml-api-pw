import { expect, test } from "@playwright/test";
import * as contractTypesSchema from "../../resources/schema/contract-types.schema";
import * as documentTypesSchema from "../../resources/schema/document-types.schema";
import * as usersSchema from "../../resources/schema/users.schema";
import * as workflowTemplateSchema from "../../resources/schema/workflow-templates.schema";
import * as contractsSchema from "../../resources/schema/contracts.schema";
import ContractTypesEndpoint from "../../endpoints/contract-types.endpoints"
import { expectResponse, validateApiResponse } from "../../../utils/validation";
import { getDataFromJSONArray } from "../../../utils/response-helper";
import UsersEndpoint from "../../endpoints/users.endpoint";
import WorkflowTemplatesEndpoint from "../../endpoints/workflow-templates.endpoint";
import DocumentTypesEndpoint from "../../endpoints/document-types.endpoint";
import { Random, RandomType } from "../../../utils/random";
import ContractEndpoints from "../../endpoints/contract.endpoints";
import { fillContractFieldsData } from "../../../utils/contract-fields-helper";
import * as path from 'path';
import { FileHelper } from "../../../utils/file-helper";

test.describe.configure({ mode: 'default' });
test.describe("@OpenAPI, @E2E-Scenarios, @Scenario-01: Scenario-01 - Submit the contract with Internal Workflow (Approver) - Single Partner (01 Assingee)", { tag: "@Scenario-01" }, () => {
    test("@Scenario-01: [C152377] GetContractTypes - Success", async () => {
        const instance = new ContractTypesEndpoint();
        const response = await instance.getContractTypes();
        expect(response.status()).toBe(200);
        const responseBody = await response.json()
        validateApiResponse(responseBody, contractTypesSchema.CONTRACT_TYPE_SUCCESS);
        // const id = getDataFromJSONArray(responseBody.data, {key: 'name', value: '契約種別なし'}, 'id');
        const id = responseBody.data[0].id;
        instance.sharedData.setContext('contract_type_id', id);
    });

    test("@Scenario-01: [C152378] - GetDocumentTypes - Success", async () => {
        const instance = new DocumentTypesEndpoint();
        const response = await instance.getDocumentTypes();
        expect(response.status()).toBe(200);
        const responseBody = await response.json()
        validateApiResponse(responseBody, documentTypesSchema.DOCUMENT_TYPES_SUCCESS);
        // const id = getDataFromJSONArray(responseBody.data, {key: 'value', value: 'Full application template edited on Sep 14th'}, 'id');
        const id = responseBody.data[0].id;
        instance.sharedData.setContext('document_type_id', id);
    });

    test("@Scenario-01: [C152380] - GetUserList - Show correct list", async () => {
        const instance = new UsersEndpoint();
        const response = await instance.get();
        expect(response.status()).toBe(200);
        const responseBody = await response.json()
        validateApiResponse(responseBody, usersSchema.USER_GET_SUCCESS);
        // const id = getDataFromJSONArray(responseBody.data, { key: 'email', value: 'ly.hong.phat+2@moneyforward.vn' }, 'id');
        const id = responseBody.data[0].id;
        instance.sharedData.setContext('person_in_charge_id', id);
    });

    test("@Scenario-01: [C152379] - GetWorkflowTemplates - Show correct list", async () => {
        const instance = new WorkflowTemplatesEndpoint();
        const response = await instance.get();
        expect(response.status()).toBe(200);
        const responseBody = await response.json()
        validateApiResponse(responseBody, workflowTemplateSchema.WORKFLOW_TEMPLATE_SUCCESS);
        const id = getDataFromJSONArray(responseBody.data, {key: 'name', value: '1 approver'}, 'id');
        // const id = responseBody.data[3].id;
        instance.sharedData.setContext('workflow_template_id', id);
    });

    test("@Scenario-01: [C152737] - PostCreateDraftContract - Internal Workflow (Approver Role)", async () => {
        const instance = new ContractEndpoints();
        await instance.initContext();
        const contract_type_id = instance.sharedData.getContext('contract_type_id');
        const document_type_id = instance.sharedData.getContext('document_type_id');
        const person_in_charge_id = instance.sharedData.getContext('person_in_charge_id');
        const workflow_template_id = instance.sharedData.getContext('workflow_template_id');
        const body = {
            name: '[OpenAPI] Automation - ' + Random.$(RandomType.ID),
            contract_type_id,
            document_type_id,
            person_in_charge_id,
            workflow_template_id
        }

        const response = await instance.createDraft(body);
        expect(response.status()).toBe(200);
        const responseBody = await response.json()
        validateApiResponse(responseBody, contractsSchema.DRAFT_CONTRACT_SUCCESS);
        const expected = delete body['workflow_template_id'];
        await expectResponse(responseBody.data, expected);
        instance.sharedData.setContext('contract_fields', responseBody.data.contract_fields);
        console.log(responseBody.data.id)
    });

    test("@Scenario-01: [C152738] - PostUpdatePDFDocument - Valid PDF file", async () => {
        const instance = new ContractEndpoints();
        await instance.initContext();
        const file = path.resolve("src/tests/resources/", "ilovepdf_merged copy.pdf");

        const payload = {
            file: FileHelper.readPDFFileAsMultipart(file),
        }
        const response = await instance.uploadDocument(payload);
        expect(response.status()).toBe(200);
    });

    test("@Scenario-01: [C152739] - PutUpdateContractFields - Following application template", async () => {
        const instance = new ContractEndpoints();
        await instance.initContext();
        const contract_fields = instance.sharedData.getContext('contract_fields');
        const updated_contract_fields = {
            'contract_fields': fillContractFieldsData(contract_fields)
        };
        const response = await instance.updateContractFields(updated_contract_fields);
        expect(response.status()).toBe(200);
    });

    test("@Scenario-01: [C152740] - SavePartnerCompanies -  Single Partner (01 Assingee)", async () => {
        const instance = new ContractEndpoints();
        const partner = [
            {
                "name": "Partner company name 1",
                "representative_name": "Partner-808",
                "approvers": [
                    {
                        "email": "ly.hong.phat+808@moneyforward.vn",
                        "name": "approver 1",
                        "company_name": "company name 1",
                        "access_key": "000001",
                        "locale": "ja"
                    }
                ]
            }
        ]
        const response = await instance.savePartner(partner);
        expect(response.status()).toBe(200);
        const responseBody = await response.json();
        validateApiResponse(responseBody, contractsSchema.SAVE_PARTNER_SUCCESS);
        const actual = responseBody.data;
        delete actual[0].id;
        delete actual[0].approvers[0].id;
        console.log(actual)
        expect(actual).toStrictEqual(partner)
    });

    test("@Scenario-01: [C152741] - PostSubmitContract - Internal Workflow (Approver) - Single Partner (01 Assingee)", async () => {
        const instance = new ContractEndpoints();
        const response = await instance.submit();
        expect(response.status()).toBe(200);
        const responseBody = await response.json();
        const expected = {}
        expect(responseBody).toStrictEqual(expected)
        console.log("Scenario-01: Contract ID " + responseBody.data.param)
    });

});


test.describe("@OpenAPI, @E2E-Scenarios, @Scenario-02: Verify the contract has been submitted and concluded successfully with Internal Authorizer & Single Partner (Multiple Assignees) ", { tag: "@Scenario-02" }, () => {
    test("@Scenario-02: [C152742] GetContractTypes - Success", async () => {
        const instance = new ContractTypesEndpoint();
        const response = await instance.getContractTypes();
        expect(response.status()).toBe(200);
        const responseBody = await response.json()
        validateApiResponse(responseBody, contractTypesSchema.CONTRACT_TYPE_SUCCESS);
        // const id = getDataFromJSONArray(responseBody.data, {key: 'name', value: '契約種別なし'}, 'id');
        const id = responseBody.data[0].id;
        instance.sharedData.setContext('contract_type_id', id);
    });

    test("@Scenario-02: [C152743] - GetDocumentTypes - Success", async () => {
        const instance = new DocumentTypesEndpoint();
        const response = await instance.getDocumentTypes();
        expect(response.status()).toBe(200);
        const responseBody = await response.json()
        validateApiResponse(responseBody, documentTypesSchema.DOCUMENT_TYPES_SUCCESS);
        // const id = getDataFromJSONArray(responseBody.data, {key: 'value', value: 'Full application template edited on Sep 14th'}, 'id');
        const id = responseBody.data[0].id;
        instance.sharedData.setContext('document_type_id', id);
    });

    test("@Scenario-02: [C152744] - GetWorkflowTemplates - Show correct list", async () => {
        const instance = new WorkflowTemplatesEndpoint();
        const response = await instance.get();
        expect(response.status()).toBe(200);
        const responseBody = await response.json()
        validateApiResponse(responseBody, workflowTemplateSchema.WORKFLOW_TEMPLATE_SUCCESS);
        const id = getDataFromJSONArray(responseBody.data, { key: 'name', value: 'Multiple authorizer'}, 'id');
        // const id = responseBody.data[3].id;
        instance.sharedData.setContext('workflow_template_id', id);
    });

    test("@Scenario-02: [C152745] - GetUserList - Show correct list", async () => {
        const instance = new UsersEndpoint();
        const response = await instance.get();
        expect(response.status()).toBe(200);
        const responseBody = await response.json()
        validateApiResponse(responseBody, usersSchema.USER_GET_SUCCESS);
        const id = getDataFromJSONArray(responseBody.data, { key: 'email', value: 'ly.hong.phat+2@moneyforward.vn' }, 'id');
        // const id = responseBody.data[0].id;
        instance.sharedData.setContext('person_in_charge_id', id);
    });


    test("@Scenario-02: [C152746] - PostCreateDraftContract - Internal Workflow (Authorizer Role)", async () => {
        const instance = new ContractEndpoints();
        await instance.initContext();
        const contract_type_id = instance.sharedData.getContext('contract_type_id');
        const document_type_id = instance.sharedData.getContext('document_type_id');
        const person_in_charge_id = instance.sharedData.getContext('person_in_charge_id');
        const workflow_template_id = instance.sharedData.getContext('workflow_template_id');
        const body = {
            name: '[OpenAPI] Automation - ' + Random.$(RandomType.ID),
            contract_type_id,
            document_type_id,
            person_in_charge_id,
            workflow_template_id
        }
        const response = await instance.createDraft(body);
        expect(response.status()).toBe(200);
        const responseBody = await response.json()
        validateApiResponse(responseBody, contractsSchema.DRAFT_CONTRACT_SUCCESS);
        const expected = delete body['workflow_template_id'];
        await expectResponse(responseBody.data, expected);
        instance.sharedData.setContext('contract_fields', responseBody.data.contract_fields);
        console.log(responseBody.data.id)
    });

    test("@Scenario-02: [C152747] - PostUpdatePDFDocument - Valid PDF file", async () => {
        const instance = new ContractEndpoints();
        await instance.initContext();
        const file = path.resolve("src/tests/resources/", "ilovepdf_merged copy.pdf");

        const payload = {
            file: FileHelper.readPDFFileAsMultipart(file),
        }
        const response = await instance.uploadDocument(payload);
        expect(response.status()).toBe(200);
    });

    test("@Scenario-02: [C152748] - PutUpdateContractFields - Following application template", async () => {
        const instance = new ContractEndpoints();
        await instance.initContext();
        const contract_fields = instance.sharedData.getContext('contract_fields');
        const updated_contract_fields = {
            'contract_fields': fillContractFieldsData(contract_fields)
        };
        const response = await instance.updateContractFields(updated_contract_fields);
        expect(response.status()).toBe(200);
    });

    test("@Scenario-02: [C152749] - SavePartnerCompanies -  Single Partner (Multiple Assingees)", async () => {
        const instance = new ContractEndpoints();
        const partner = [
            {
                "name": "Partner company name 1",
                "representative_name": "Partner-808",
                "approvers": [
                    {
                        "email": "ly.hong.phat+808@moneyforward.vn",
                        "name": "approver 1",
                        "company_name": "company name 1",
                        "access_key": "000001",
                        "locale": "ja"
                    },
                    {
                        "email": "ly.hong.phat+909@moneyforward.vn",
                        "name": "approver 1",
                        "company_name": "company name 1",
                        "access_key": "000001",
                        "locale": "en"
                    }
                ]
            }
        ]
        const response = await instance.savePartner(partner);
        expect(response.status()).toBe(200);
        const responseBody = await response.json();
        validateApiResponse(responseBody, contractsSchema.SAVE_PARTNER_SUCCESS);
        const actual = responseBody.data;
        delete actual[0].id;
        delete actual[0].approvers[0].id;
        delete actual[0].approvers[1].id;
        console.log(actual)
        expect(actual).toStrictEqual(partner)
    });

    test("@Scenario-02: [C152750] - PostSubmitContract - Internal Workflow (Authorizer) - Single Partner (Multiple Assingees)", async () => {
        const instance = new ContractEndpoints();
        const response = await instance.submit();
        expect(response.status()).toBe(200);
        const responseBody = await response.json();
        const expected = {}
        expect(responseBody).toStrictEqual(expected)
    });

});



