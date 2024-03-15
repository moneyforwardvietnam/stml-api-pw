import {Random, RandomType} from "../../utils/random";
import AuthedRequest from "../../utils/request/authed-request";
import {HttpMethod} from "../../utils/request/http-method";
import {AppId} from "./app-id.enum";


const BILLINGS_EP = '/api/v3/billings'
const ITEMS_EP='api/v3/items'

export default class BillingsEndpoint extends AuthedRequest {

  get = async () => {
    await this.initContext();
    const params = { "page": 1, "per_page": 20 }
    return await this.requestSender(HttpMethod.GET, BILLINGS_EP, { params: params });
  }

  create = async () => {
    await this.initContext();
    const sharedData = await this.sharedData;

    const data = {
      "department_id": sharedData.getContext(AppId.APP_DEPARTMENT_ID),
      "billing_date": "2024/01/01",
      "due_date": "2024/01/10",
      "title": "api-V3 create billing"
    }

    const response = await this.requestSender(HttpMethod.POST, BILLINGS_EP, { data: data });
    sharedData.setContext(AppId.APP_BILLING_ID, (await response.json()).id);
    return response;
  }

  createByData = async (data: any) => {
    await this.initContext();
    const sharedData = await this.sharedData;

    const response = await this.requestSender(HttpMethod.POST, BILLINGS_EP, { data: data });
    sharedData.setContext(AppId.APP_BILLING_ID, (await response.json()).id);
    return response;
  }

  createItem = async () => {
    await this.initContext();
    const sharedData = await this.sharedData;

    const randomString = Random.$(RandomType.STRING);
    const data = {
      "name": "name_"+ randomString,
      "code": "code_"+randomString,
      "detail": "detail_"+randomString,
      "unit": "unit_"+randomString,
      "price": "10000", 
      "quantity": "999.9",
       "is_deduct_withholding_tax": true, 
       "excise": "eight_percent_as_reduced_tax_rate"
    }

    const response = await this.requestSender(HttpMethod.POST, ITEMS_EP, { data: data });
    sharedData.setContext(AppId.APP_ITEM_ID, (await response.json()).id);
    return response;
  }

  deleteById = async (item_id:any) => {
    await this.initContext();
    const path = `${BILLINGS_EP}/${item_id}`
    return await this.requestSender(HttpMethod.DELETE, path);
  }

  delete = async () => {
    await this.initContext();
    const sharedData = await this.sharedData;
    return await this.deleteById(sharedData.getContext(AppId.APP_BILLING_ID));
  }


  deleteItem = async () => {
    await this.initContext();
    const sharedData = await this.sharedData;
    const path = `${ITEMS_EP}/${sharedData.getContext(AppId.APP_ITEM_ID)}`;
    return await this.requestSender(HttpMethod.DELETE, path);
  }
}
