import AuthedRequest from "../../utils/request/authed-request";
import {HttpMethod} from "../../utils/request/http-method";


const WORKFLOW_TEMPLATES_EP = '/v1/workflow_templates'

export default class WorkflowTemplatesEndpoint extends AuthedRequest {
    get = async () => {
        await this.initContext();
        return await this.requestSender(HttpMethod.GET, WORKFLOW_TEMPLATES_EP);
    }
}
