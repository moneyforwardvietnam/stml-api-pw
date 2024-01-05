import AuthenRequest from "../../utils/request/authen-request";
import { HttpMethod } from "../../utils/request/http-method";


const GET_BILLINGS = '/api/v3/billings'

export default class BillingsEndpoint extends AuthenRequest{
    getBillings = async () => {
        await this.initContext();
        const params = {"page":1,"per_page":20}
        return await this.requestSender(HttpMethod.GET, GET_BILLINGS,{params:params});
      }
}
