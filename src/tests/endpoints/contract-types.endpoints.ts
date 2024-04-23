//import {Random, RandomType} from "../../utils/random";
import AuthedRequest from "../../utils/request/authed-request";
import { HttpMethod } from "../../utils/request/http-method";
//import {AppId} from "./app-id.enum";


const CONTRACT_TYPE_EP = '/v1/contract_types'

export default class ContractTypesEndpoint extends AuthedRequest {
    getContractTypes = async (header?: any, id?: string) => {
        if (id) {
            await this.initContext({ id: id });
        } else {
            await this.initContext();
        }
        return await this.requestSender(HttpMethod.GET, CONTRACT_TYPE_EP, undefined, header);
    }


    requestMethodsContracTypes = async (method: HttpMethod, header?: any, id?: string) => {
        if (id) {
            await this.initContext({ id: id });
        } else {
            await this.initContext();
        }
        return await this.requestSender(method, CONTRACT_TYPE_EP, undefined, header);
    }
}
