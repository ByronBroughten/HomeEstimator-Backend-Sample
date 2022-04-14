import request from "supertest";
import Analyzer from "../../client/src/App/sharedWithServer/Analyzer";
import {
  apiEndpoints,
  NextReq,
} from "../../client/src/App/sharedWithServer/apiQueriesShared";
import { isLoginUserNext } from "../../client/src/App/sharedWithServer/apiQueriesShared/Login";
import { runApp } from "../../runApp";
import { UserModelNext } from "../shared/UserModelNext";
import { userServerSideNext } from "../shared/userServerSideNext";

function makeTestRegisterReq(): NextReq<"nextRegister"> {
  let next = Analyzer.initAnalyzer();
  next = next.updateSectionValuesAndSolve("register", {
    email: "testosis@gmail.com",
    password: "testpassword",
    userName: "Testosis",
  });
  return next.req.nextRegister();
}

describe(apiEndpoints.nextRegister.pathRoute, () => {
  // prep
  let server: ReturnType<typeof runApp> | any;
  let reqObj: NextReq<"nextRegister">;

  beforeEach(async () => {
    reqObj = makeTestRegisterReq();
    server = runApp();
  });

  // register route: "/api/user/register"
  const exec = async () =>
    await request(server)
      .post(apiEndpoints.nextRegister.pathRoute)
      .send(reqObj.body);
  async function testStatus(statusNumber: number) {
    const res = await exec();
    expect(res.status).toBe(statusNumber);
  }

  afterEach(async () => {
    await UserModelNext.deleteMany();
    server.close();
  });
  it("should return 500 if the payload is not an object", async () => {
    (reqObj.body.payload as any) = null;
    await testStatus(500);
  });
  it("should return 400 if the payload fails validation", async () => {
    (reqObj.body.payload.registerFormData.email as any) = null;
    await testStatus(400);
  });
  it("should return 500 if guestAccessSections isn't right", async () => {
    (reqObj.body.payload.guestAccessSections as any) = null;
    await testStatus(500);
  });
  it("should return 400 if a user with that email already exists", async () => {
    const reqObj2 = makeTestRegisterReq();
    const userDoc = await userServerSideNext.entireMakeUserProcess(
      reqObj2.body.payload
    );
    await userDoc.save();
    await testStatus(400);
  });
  it("should return 200 if the request is valid", async () => {
    await testStatus(200);
  });
  it("should return a logged in user if the request is valid", async () => {
    const res = await exec();
    expect(isLoginUserNext(res.body.data)).toBe(true);
  });
});