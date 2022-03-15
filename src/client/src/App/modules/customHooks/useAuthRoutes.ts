import { AxiosResponse } from "axios";
import { config } from "../../Constants";
import {
  authTokenKey,
  isLoginHeaders,
  LoginFormData,
  makeReq,
  RegisterFormData,
  Req,
  Res,
} from "../../sharedWithServer/User/crudTypes";
import { isLoginUser } from "../../sharedWithServer/User/DbUser";
import { auth } from "../services/authService";
import https from "../services/httpService";
import { useAnalyzerContext } from "../usePropertyAnalyzer";

const validate = {
  loginRes(res: AxiosResponse<unknown> | undefined): Res<"Login"> | undefined {
    if (res && isLoginUser(res.data) && isLoginHeaders(res.headers)) {
      return {
        data: res.data,
        headers: res.headers,
      };
    } else return undefined;
  },
};

export function useAuthRoutes() {
  const { analyzer, handle } = useAnalyzerContext();
  function trySetLogin(res: AxiosResponse<unknown> | undefined) {
    const reqObj = validate.loginRes(res);
    if (!reqObj) return;
    const { data, headers } = reqObj;
    auth.setToken(headers[authTokenKey]);
    handle("loadSectionArrsAndSolve", data);
  }

  return {
    async login(loginFormData: LoginFormData) {
      const reqObj: Req<"Login"> = {
        body: { payload: loginFormData },
      };
      const res = await https.post(
        "logging in",
        config.url.login.path,
        reqObj.body
      );
      trySetLogin(res);
    },
    async register(registerFormData: RegisterFormData) {
      const reqObj: Req<"Register"> = makeReq.register(
        analyzer,
        registerFormData
      );
      const res = await https.post(
        "registering",
        config.url.register.path,
        reqObj.body
      );
      trySetLogin(res);
    },
  };
}
