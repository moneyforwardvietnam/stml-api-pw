import AuthedRequest from "../../utils/request/authed-request";
import {HttpMethod} from "../../utils/request/http-method";


const USER_EP = '/v1/users?size=1000'

export default class UsersEndpoint extends AuthedRequest {
    get = async () => {
        await this.initContext();
        return await this.requestSender(HttpMethod.GET, USER_EP);
    }
}
