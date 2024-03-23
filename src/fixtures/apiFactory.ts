import BillingsEndpoint from "../tests/endpoints/billings-endpoint";
import AuthedRequest from '../utils/request/authed-request'

import {authedReq as authedRequest, test as baseTest} from './apiFixture'

require('dotenv').config()

type apiType = {
    billingEndpoint: BillingsEndpoint;
}
const apiFactory = baseTest.extend<apiType>({
    billingEndpoint: async ({}, use) => {
        const endpoint = new BillingsEndpoint();
        await endpoint.initContext()
        await use(endpoint)
    },
})


export const test = apiFactory
export const apiRequest: AuthedRequest = authedRequest

test.beforeAll(async ({}) => {
    const authedRequest = new AuthedRequest()
    await authedRequest.initContext()
})
