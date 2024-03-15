import {getToken} from '../authenticator/secure-token';
import RequestContext from './request-context';
import {test} from "@playwright/test";

export default class AuthedRequest extends RequestContext {
    public id: number | string | undefined
    constructor() {
        super(process.env.BASE_URI);
    }

    initContext = async (options?: { isTearDown?: boolean }) => {
        let id = String(this.id);
        if (!options?.isTearDown || id == undefined) {
            id = String(test.info().parallelIndex)
            await this.setId(id)
        }

        const token = await getToken(id);
        const headers = {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json'
        }
        await this.setHeader(headers);
        return await this.initialize();
    }

    setId = async (id: number|string) => {
        this.id = id
    }
}
