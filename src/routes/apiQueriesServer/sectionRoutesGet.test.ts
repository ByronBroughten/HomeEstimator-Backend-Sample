import request from "supertest";
import { config } from "../../client/src/App/Constants";
import Analyzer from "../../client/src/App/sharedWithServer/Analyzer";
import { authTokenKey, Req } from "../../client/src/App/sharedWithServer/Crud";
import { urlPlusParams } from "../../client/src/App/utils/url";
import { runApp } from "../../runApp";
import { sectionRoutes } from "../sectionRoutes";
import { serverSideUser, UserModel } from "../shared/userServerSide";
import { serverSideLogin } from "../userRoutes/shared/doLogin";

describe("section get", () => {
  const sectionName = "propertyDefault";
  let analyzer: Analyzer;
  let req: Req<"GetSection">;
  let server: any;
  let token: string;

  const exec = async () => {
    const route = urlPlusParams(
      sectionRoutes.route,
      req.params,
      config.crud.routes.section.get.paramArr
    );
    return await request(server).get(route).set(authTokenKey, token).send();
  };

  async function testStatus(statusNumber: number) {
    const res = await exec();
    expect(res.status).toBe(statusNumber);
    return res;
  }

  beforeEach(async () => {
    analyzer = Analyzer.initAnalyzer();
    analyzer = analyzer.updateSectionValuesAndSolve("register", {
      email: "testosis@gmail.com",
      password: "testpassword",
      userName: "Testosis",
    }); // I need the dbId, so I must put a section with a dbId into UserModel, first
    const { dbId } = analyzer.section(sectionName);
    req = analyzer.req.getSection(sectionName, dbId);
    server = runApp();
    const registerReq = analyzer.req.register();
    const userDoc = await serverSideUser.full(registerReq.body.payload);
    await userDoc.save();
    const userId = userDoc._id.toHexString();
    token = serverSideLogin.makeUserAuthToken(userId);
  });

  afterEach(async () => {
    await UserModel.deleteMany();
    server.close();
  });
  it("should return 500 if the dbId isn't a valid dbId", async () => {
    req.params.dbId = Analyzer.makeId().substring(1);
    await testStatus(500);
  });
  it("should return 404 if no section in the queried sectionArr has the dbId", async () => {
    req.params.dbId = Analyzer.makeId();
    await testStatus(404);
  });
  it("should return 200 if the request is valid", async () => {
    const res = await testStatus(200);
    expect(res.body.dbId).toBe(req.params.dbId);
  });
});