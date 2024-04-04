import {getToken} from '../authenticator/secure-token';
import RequestContext from './request-context';
import {test} from "@playwright/test";
import { ScenarioContext } from "../../tests/context/scenario-context";


export default class AuthedRequest extends RequestContext {
    public id: number | string | undefined

    constructor() {
        super(process.env.OPEN_API_HOST);
    }

    initContext = async (options?: { isTearDown?: boolean, id?: string }) => {
        let id = String(this.id);
        if (!options?.isTearDown || id == undefined) {
            id = options?.id === undefined ? String(test.info().parallelIndex): options?.id;
            await this.setId(id)
        }

        const token = await getToken(id);
        const headers = {
            'X-Token': token,
            'Content-Type': 'application/json'
        }
        // const headers = {
        //     'Authorization': `Bearer ${token}`,
        //     'Content-Type': 'application/json'
        // }
        await this.setSharedData(await ScenarioContext.getInstance(this.id));
        await this.setHeader(headers);
        return await this.initialize();
    }

    setId = async (id: number | string) => {
        this.id = id
    }
}
