import {expect, test} from "@playwright/test";
import {HttpMethod} from "../../utils/request/http-method";
import AuthedRequest from "../../utils/request/authed-request";
import OfficeEndpoint from "../endpoints/office-endpoint";


test.describe.configure({mode: 'default'});
test('@tc-09 fixed account id', async () => {

    const instance = new OfficeEndpoint();
    const response = await instance.getOffice("0");
    expect(response.status()).toBe(200);

    const authed = new AuthedRequest();
    await authed.initContext({id: "2"})
    const response2 = await authed.requestSender(HttpMethod.GET, '/api/v3/office');
    expect(response2.status()).toBe(200);
});