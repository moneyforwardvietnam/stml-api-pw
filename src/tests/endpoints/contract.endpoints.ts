import AuthedRequest from "../../utils/request/authed-request";
import {HttpMethod} from "../../utils/request/http-method";
import {AppId} from "./app-id.enum";


const CONTRACT_EP = '/v1/contracts'

export default class ContractEndpoints extends AuthedRequest {

    createDraft = async (data: any) => {
        await this.initContext();

        const response = await this.requestSender(HttpMethod.POST, CONTRACT_EP, {data: data});
        this.sharedData.setContext(AppId.CONTRACT_ID, (await response.json()).data.id);
        return response;
    }

    uploadDocument = async (multipart: any, contract_id?: string) => {
        const header = {
            "accept": "application/json, text/plain, */*",
            "Content-Type": undefined
        }
        await this.setExtraHeader(header);
        await this.initContext();
        contract_id = contract_id === undefined ? this.sharedData.getContext(AppId.CONTRACT_ID) : contract_id;
        const path = CONTRACT_EP + `/${contract_id}/documents`;
        return await this.requestFetch('post', path, {
            multipart: multipart,
        });
    }

    updateContractFields = async (data: any, contract_id?: string) => {
        await this.initContext();
        contract_id = contract_id === undefined ? this.sharedData.getContext(AppId.CONTRACT_ID) : contract_id;
        const path = CONTRACT_EP + `/${contract_id}/fields`;
        return await this.requestSender(HttpMethod.PUT, path, {
            data
        });
    }


    savePartner = async (data: any, contract_id?: string) => {
        await this.initContext();
        contract_id = contract_id === undefined ? this.sharedData.getContext(AppId.CONTRACT_ID) : contract_id;
        const path = CONTRACT_EP + `/${contract_id}/partner_companies`;
        return await this.requestSender(HttpMethod.POST, path, {
            data
        });
    }

    submit = async (contract_id?: string) => {
        await this.initContext();
        contract_id = contract_id === undefined ? this.sharedData.getContext(AppId.CONTRACT_ID) : contract_id;
        const path = CONTRACT_EP + `/${contract_id}/confirm`;
        return await this.requestSender(HttpMethod.POST, path);
    }
}