import AuthedRequest from "../../utils/request/authed-request";
import {HttpMethod} from "../../utils/request/http-method";

const GET_OFFICE = '/api/v3/office'

export default class OfficeEndpoint extends AuthedRequest {
    getOffice = async (id?: string | undefined) => {
        await this.initContext({id: id});
        return await this.requestSender(HttpMethod.GET, GET_OFFICE);
    }
}
