import AuthenRequest from "../../utils/request/authen-request";
import { HttpMethod } from "../../utils/request/http-method";


const GET_OFFICE = '/api/v3/office'

export default class OfficeEndpoint extends AuthenRequest{
    getOffice = async () => {
        await this.initContext();
        return await this.requestSender(HttpMethod.GET, GET_OFFICE);
      }
}
