import { expect, test } from "@playwright/test";
import * as contractTypes from "../resources/schema/contract-types.schema";
import * as documentTypesSC from "../resources/schema/document-types.schema";
import * as usersSC from "../resources/schema/users.schema";
import * as wflTemplatesSC from "../resources/schema/workflow-templates.schema";
import * as contractsSC from "../resources/schema/contracts.schema";
import ContractTypesEndpoint from "../endpoints/contract-types.endpoints"
import { expectResponse, validateApiResponse } from "../../utils/validation";
import { getDataFromJSONArray } from "../../utils/response-helper";
import UsersEndpoint from "../endpoints/users.endpoint";
import WorkflowTemplatesEndpoint from "../endpoints/workflow-templates.endpoint";
import DocumentTypesEndpoint from "../endpoints/document-types.endpoint";
import { Random, RandomType } from "../../utils/random";
import ContractEndpoints from "../endpoints/contract.endpoints";
import { fillContractFieldsData } from "../../utils/contract-fields-helper";
import * as path from 'path';
import { FileHelper } from "../../utils/file-helper";

test.describe.configure({ mode: 'default' });
test('@apply-concluded-01: GetContractTypes - Success', async () => {
    const instance = new ContractTypesEndpoint();
    const response = await instance.getContractTypes();
    expect(response.status()).toBe(200);
    const responseBody = await response.json()
    validateApiResponse(responseBody, contractTypes.CONTRACT_TYPE_SUCCESS_ShowList);
    const id = getDataFromJSONArray(responseBody.data, { key: 'name', value: '契約種別なし' }, 'id');
    // const id = responseBody.data[0].id;
    instance.sharedData.setContext('contract_type_id', id);
});

test('@apply-concluded-02: GetDocumentTypes - Success', async () => {
    const instance = new DocumentTypesEndpoint();
    const response = await instance.getDocumentTypes();
    expect(response.status()).toBe(200);
    const responseBody = await response.json()
    validateApiResponse(responseBody, documentTypesSC.GET_SUCCESS);
    // const id = getDataFromJSONArray(responseBody.data, {key: 'value', value: 'Full application template edited on Sep 14th'}, 'id');
    const id = responseBody.data[0].id;
    instance.sharedData.setContext('document_type_id', id);
});

test('@apply-concluded-03: GetUserList - Success - Show correct list', async () => {
    const instance = new UsersEndpoint();
    const response = await instance.get();
    expect(response.status()).toBe(200);
    const responseBody = await response.json()
    validateApiResponse(responseBody, usersSC.USER_GET_SUCCESS);
    // const id = getDataFromJSONArray(responseBody.data, {key: 'email', value: 'nguyen.ha.nhan@moneyforward.vn'}, 'id');
    const id = responseBody.data[0].id;
    instance.sharedData.setContext('person_in_charge_id', id);
});

test('@apply-concluded-04: GetWorkflowTemplates - Success - Show correct list', async () => {
    const instance = new WorkflowTemplatesEndpoint();
    const response = await instance.get();
    expect(response.status()).toBe(200);
    const responseBody = await response.json()
    validateApiResponse(responseBody, wflTemplatesSC.GET_SUCCESS);
    // const id = getDataFromJSONArray(responseBody.data, {key: 'name', value: '1 approver'}, 'id');
    const id = responseBody.data[4].id;
    instance.sharedData.setContext('workflow_template_id', id);
});

test('@apply-concluded-05: PostCreateDraftContract - Success - Internal Workflow (Approver Role)', async () => {
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
    validateApiResponse(responseBody, contractsSC.POST_SUCCESS);
    const expected = delete body['workflow_template_id'];
    await expectResponse(responseBody.data, expected);
    instance.sharedData.setContext('contract_fields', responseBody.data.contract_fields);
    console.log(responseBody.data.id)
});

test('@apply-concluded-06: PostUpdatePDFDocument - Success - Valid PDF file', async () => {
    const instance = new ContractEndpoints();
    await instance.initContext();
    const file = path.resolve("src/tests/resources/", "upload.pdf");

    const payload = {
        file: FileHelper.readPDFFileAsMultipart(file),
    }

    const response = await instance.uploadDocument(payload);
    expect(response.status()).toBe(200);
});

test('@apply-concluded-07: PutUpdateContractFields - Following application template', async () => {
    const instance = new ContractEndpoints();
    await instance.initContext();
    const contract_fields = instance.sharedData.getContext('contract_fields');
    const updated_contract_fields = {
        'contract_fields': fillContractFieldsData(contract_fields)
    };
    const response = await instance.updateContractFields(updated_contract_fields);
    expect(response.status()).toBe(200);
});

test('@apply-concluded-08: SavePartnerCompanies - Success - Single Partner company_Multiple assignees', async () => {
    const instance = new ContractEndpoints();
    const partner = [
        {
            "name": "Partner company name 1 - Automation team core",
            "representative_name": "Brice",
            "approvers": [
                {
                    "email": "ly.hong.phat+stml01@moneyforward.vn",
                    "name": "approver 1",
                    "company_name": "company name 1",
                    "access_key": "000001",
                    "locale": "ja"
                },
                {
                    "email": "ly.hong.phat+OpenAPI-Imprinter@moneyforward.co.jp",
                    "name": "approver 3",
                    "company_name": "company name 1",
                    "access_key": "456",
                    "locale": "en"
                }
            ]
        }
    ]

    const response = await instance.savePartner(partner);
    expect(response.status()).toBe(200);
    const responseBody = await response.json();
    validateApiResponse(responseBody, contractsSC.SAVE_PARTNER_SUCCESS);
    const actual = responseBody.data;
    delete actual[0].id;
    delete actual[0].approvers[0].id;
    delete actual[0].approvers[1].id;
    console.log(actual)
    expect(actual).toStrictEqual(partner)
});

test('@apply-concluded-08: PostSubmitContract - Success', async () => {
    const instance = new ContractEndpoints();
    const response = await instance.submit();
    expect(response.status()).toBe(200);
    const responseBody = await response.json();
    const expected = {}
    expect(responseBody).toStrictEqual(expected)
});







