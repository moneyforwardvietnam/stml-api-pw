import {test as baseTest} from '@playwright/test'
import AuthedRequest from '../utils/request/authed-request'

let authedRequest
export const test = baseTest.extend<{ AuthedRequest: any }, { workerStorageState: string }>({
  storageState: ({ workerStorageState }, use) => use(workerStorageState),
  workerStorageState: [
    // eslint-disable-next-line no-empty-pattern
    async ({}) => {
      authedRequest = new AuthedRequest()
      const id = test.info().parallelIndex
      await authedRequest.setId(id)
    },
    { scope: 'worker' }
  ]
})

export const expect = test.expect
export const authedReq: AuthedRequest = authedRequest
export { APIResponse } from '@playwright/test'
