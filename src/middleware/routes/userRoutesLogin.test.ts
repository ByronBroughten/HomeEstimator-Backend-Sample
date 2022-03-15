import {
  authTokenKey,
  makeReq,
  Req,
} from "../../client/src/App/sharedWithServer/User/crudTypes";
import { makeDbUser, prepNewUserData, UserModel } from "./shared/makeDbUser";
import { decodeAndCheckUserToken } from "./userRoutes/shared/doLogin";
import request from "supertest";
import { runApp } from "../../runApp";
import { omit } from "lodash";
import { config } from "../../client/src/App/Constants";
import Analyzer from "../../client/src/App/sharedWithServer/Analyzer";

const registerFormData = {
  email: "testosis@gmail.com",
  password: "testpassword",
  userName: "Testosis",
} as const;
function makeTestRegisterReq(): Req<"Register"> {
  const analyzer = Analyzer.initAnalyzer();
  return makeReq.register(analyzer, registerFormData);
}
function makeTestLoginReq(): Req<"Login"> {
  return {
    body: {
      payload: omit(registerFormData, ["userName"]),
    },
  };
}

describe(config.url.login.route, () => {
  let server: ReturnType<typeof runApp> | any;
  let reqObj: Req<"Login">;

  beforeEach(async () => {
    reqObj = makeTestLoginReq();
    server = runApp();
    const registerReqObj = makeTestRegisterReq();
    const { payload } = registerReqObj.body;
    const newUserData = await prepNewUserData(payload);

    const userDoc = new UserModel(makeDbUser(newUserData));
    await userDoc.save();
  });

  const exec = () =>
    request(server).post(config.url.login.route).send(reqObj.body);
  async function testStatus(statusNumber: number) {
    const res = await exec();
    expect(res.status).toBe(statusNumber);
  }

  afterEach(async () => {
    await UserModel.deleteMany();
  });
  it("should return 500 if payload is not an object", async () => {
    reqObj.body.payload = null as any;
    await testStatus(500);
  });
  it("should return 400 if payload fails validation", async () => {
    reqObj.body.payload.email = null as any;
    await testStatus(400);
  });
  it("should return 400 if an account with the email doesn't exist", async () => {
    reqObj.body.payload.email = "nonexistant@gmail.com";
    await testStatus(400);
  });
  it("should return 400 if an invalid password is used", async () => {
    reqObj.body.payload.password = "invalidP@ssword123";
    await testStatus(400);
  });
  it("should return 200 if the request is valid", async () => {
    await testStatus(200);
  });
  it("should return an auth token if the request is valid", async () => {
    const res = await exec();
    const token = res.headers[authTokenKey];
    expect(token).not.toBeUndefined();

    const decoded = decodeAndCheckUserToken(token);
    expect(decoded).not.toBeNull();
  });
  it("should return a logged in user if the request is valid", async () => {});
});
