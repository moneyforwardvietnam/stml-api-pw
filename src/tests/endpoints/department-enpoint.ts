import {Random, RandomType} from "../../utils/random";
import AuthedRequest from "../../utils/request/authed-request";
import {HttpMethod} from "../../utils/request/http-method";
import {AppId} from "./app-id.enum";

const PARTNERS_EP = '/api/v3/partners'

export default class DepartmentEndpoint extends AuthedRequest {
  create = async () => {
    await this.initContext();

    const id = this.sharedData.getContext(AppId.APP_PARTNER_ID)
    const path = `${PARTNERS_EP}/${id}/departments`;

    const data = {
      "zip": Random.$(RandomType.ZIP_CODE),
      "tel": Random.$(RandomType.PHONE),
      "prefecture": "山形県",
      "address1": Random.$(RandomType.ADDRESS),
      "address2": Random.$(RandomType.ADDRESS),
      "person_name": Random.$(RandomType.NAME),
      "person_title": Random.$(RandomType.NAME),
      "person_dept": Random.$(RandomType.NAME),
      "office_member_name": Random.$(RandomType.NAME),
      "email": Random.$(RandomType.EMAIL),
      "cc_emails": Random.$(RandomType.EMAIL),
    }
    const response = await this.requestSender(HttpMethod.POST, path, { data: data });
    this.sharedData.setContext(AppId.APP_DEPARTMENT_ID, (await response.json()).id);
    return response;
  }

  get = async () => {
    await this.initContext();
    const id = this.sharedData.getContext(AppId.APP_PARTNER_ID)
    const path = `${PARTNERS_EP}/${id}`;
    const params = {
      "page": 1,
      "per_page": 1
    }
    return await this.requestSender(HttpMethod.GET, path, {params: params});
  }

  delete = async () => {
    await this.initContext();
    const path = `${PARTNERS_EP}/${this.sharedData.getContext(AppId.APP_PARTNER_ID)}/departments/${this.sharedData.getContext(AppId.APP_DEPARTMENT_ID)}`;
    return await this.requestSender(HttpMethod.DELETE, path);
  }
}
