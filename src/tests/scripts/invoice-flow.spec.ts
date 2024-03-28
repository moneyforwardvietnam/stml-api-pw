import {expect, test} from "@playwright/test";
import OfficeEndpoint from "../endpoints/office-endpoint";
import {expectResponse, validateApiResponse} from "../../utils/validation";
import BillingsEndpoint from "../endpoints/billings-endpoint";
import PartnerEndpoint from "../endpoints/partner-enpoint";
import {BILLINGS_INFO, CREATE_BILLINGS} from "../resources/schema/billings.schema";
import {PARTNER_INFO} from "../resources/schema/partner.schema";
import DepartmentEndpoint from "../endpoints/department-enpoint";
import {AppId} from "../endpoints/app-id.enum";
import {DEPARTMENT_INFO} from "../resources/schema/department.schema";
import {Random, RandomType} from "../../utils/random";
import {HttpMethod} from "../../utils/request/http-method";
import AuthedRequest from "../../utils/request/authed-request";


test.describe.configure({mode: 'default'});
test('C55306: @tc-01 Verify token - get office - status code', async () => {
    const instance = new OfficeEndpoint();
    const response = await instance.getOffice();
    expect(response.status()).toBe(200);
});

test('C55307: @tc-02 Status code - Get billings - accepted - valid info - is 200', async () => {
    const instance = new BillingsEndpoint();
    const response = await instance.get();
    expect(response.status()).toBe(200);
    const responseBody = await response.json()
    validateApiResponse(responseBody, BILLINGS_INFO);
});

test('C55308: @tc-03 Status code - Create partner - valid values - is 201', async () => {
    const instance = new PartnerEndpoint();
    const response = await instance.create();
    expect(response.status()).toBe(201);
    const responseBody = await response.json()

    const randomString = (await instance.sharedData).getContext("randomString");

    const expectedData = {
        code: randomString,
        name: "Auto test " + randomString,
        name_kana: randomString,
        name_suffix: "御中",
        memo: randomString
    }
    await expectResponse(responseBody, expectedData)
    validateApiResponse(responseBody, PARTNER_INFO);
});

test('C55309: @tc-04 Status code - Get partner id - is 200', async () => {
    const instance = new PartnerEndpoint();
    const response = await instance.get();
    expect(response.status()).toBe(200);
    validateApiResponse(await response.json(), PARTNER_INFO);
});

test('C55310: @tc-05 Status code - Create billing - Department id - accepted - valid id - is 201', async () => {
    const departmentInstance = new DepartmentEndpoint();
    const responseCreate = await departmentInstance.create();
    expect(responseCreate.status()).toBe(201);
    const billingInstance = new BillingsEndpoint();
    const response = await billingInstance.create();
    expect(response.status()).toBe(201);

    const responseBody = await response.json();
    expect(responseBody.department_id).toBe((await billingInstance.sharedData).getContext(AppId.APP_DEPARTMENT_ID));
    validateApiResponse(responseBody, DEPARTMENT_INFO);
});

test('C55311: @tc-06 Status code - Create billing - Department id - accepted - valid id - is 201', async () => {
    const billingInstance = new BillingsEndpoint();

    const random_StringID = Random.$(RandomType.STRING);

    const data = {
        department_id: (await billingInstance.sharedData).getContext(AppId.APP_DEPARTMENT_ID),
        title: `create billing_${random_StringID}`,
        memo: "memo_" + random_StringID,
        payment_condition: "payment_condition_" + random_StringID,
        billing_date: "2022/12/09",
        due_date: "2022/12/10",
        sales_date: "2022/12/09",
        billing_number: "billing num_" + random_StringID,
        note: "note_" + random_StringID,
        document_name: "doc name_" + random_StringID,
        tag_names: [
            "tag_" + random_StringID
        ],
        items: [
            {
                name: "item 003",
                unit_price: "10",
                unit: "",
                quantity: Random.$(RandomType.INT_STR),
                excise: "untaxable"
            },
            {
                name: "product 111",
                unit_price: "5",
                unit: "",
                quantity: Random.$(RandomType.INT_STR),
                excise: "untaxable"
            }
        ]
    }

    const response = await billingInstance.createByData(data);
    expect(response.status()).toBe(201);
    const responseBody = await response.json();
    validateApiResponse(responseBody, CREATE_BILLINGS);
});

test('C55312: @tc-07 Status code - Attach an Item into a Billing - Item id - accepted - valid item id - is 201', async () => {
    const billingInstance = new BillingsEndpoint();
    const response = await billingInstance.createItem();
    expect(response.status()).toBe(201);

    const item_id = (await billingInstance.sharedData).getContext(AppId.APP_ITEM_ID);
    const billing_id = (await billingInstance.sharedData).getContext(AppId.APP_BILLING_ID);
    const path = `/api/v3/billings/${billing_id}/items`
    const data = {item_id: item_id}

    const authed = new AuthedRequest();
    await authed.initContext()
    const response2 = await authed.requestSender(HttpMethod.POST, path, {data: data})
    expect(response2.status()).toBe(201);
    expect(response2.statusText()).toBe('Created');
});

test('C55313: @tc-08 Clean test data - Delete Billing, Item, Department, Partner', async () => {
    const billingInstance = new BillingsEndpoint();
    let response = await billingInstance.delete();
    expect(response.status()).toBe(204);
    response = await billingInstance.deleteItem();
    expect(response.status()).toBe(204);


    const departmentInstance = new DepartmentEndpoint();
    response = await departmentInstance.delete();
    expect(response.status()).toBe(204);

    const partnerInstance = new PartnerEndpoint();
    response = await partnerInstance.delete();
    expect(response.status()).toBe(204);
});