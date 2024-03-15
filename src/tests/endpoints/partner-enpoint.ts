import {Random, RandomType} from "../../utils/random";
import AuthedRequest from "../../utils/request/authed-request";
import {HttpMethod} from "../../utils/request/http-method";
import {AppId} from "./app-id.enum";

const PARTNERS_EP = '/api/v3/partners'

export default class PartnerEndpoint extends AuthedRequest {
  create = async () => {
    await this.initContext();
    const sharedData = await this.sharedData;
    const randomString = Random.$(RandomType.STRING);
    sharedData.setContext("randomString", randomString);
    const data = {
      "code": randomString,
      "name": "Auto test " + randomString,
      "name_kana": randomString,
      "name_suffix": "御中",
      "memo": randomString
    }
    const response = await this.requestSender(HttpMethod.POST, PARTNERS_EP, { data: data });
    sharedData.setContext(AppId.APP_PARTNER_ID, (await response.json()).id);
    return response;
  }

  get = async () => {
    await this.initContext();
    const sharedData = await this.sharedData;
    const id = sharedData.getContext(AppId.APP_PARTNER_ID)
    const path = `${PARTNERS_EP}/${id}`;
    const params = {
      "page": 1,
      "per_page": 1
    }
    return await this.requestSender(HttpMethod.GET, path, {params: params});
  }

  delete = async () => {
    await this.initContext();
    const sharedData = await this.sharedData;
    const path = `${PARTNERS_EP}/${sharedData.getContext(AppId.APP_PARTNER_ID)}`;
    return await this.requestSender(HttpMethod.DELETE, path);
  }
}
