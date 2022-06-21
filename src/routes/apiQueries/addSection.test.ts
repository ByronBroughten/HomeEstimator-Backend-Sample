import { Server } from "http";
import request from "supertest";
import { config } from "../../client/src/App/Constants";
import { apiQueriesShared } from "../../client/src/App/sharedWithServer/apiQueriesShared";
import { NextReq } from "../../client/src/App/sharedWithServer/apiQueriesShared/apiQueriesSharedTypes";
import { Arr } from "../../client/src/App/sharedWithServer/utils/Arr";
import { runApp } from "../../runApp";
import { UserModel } from "../UserModel";
import { DbUser } from "./shared/DbSections/DbUser";
import { getUserByIdNoRes } from "./shared/getUserDbSectionsById";
import { createTestUserModelNext } from "./test/createTestUserModelNext";
import { SectionQueryTester } from "./test/SectionQueryTester";

function makeAddSectionReq(): NextReq<"addSection"> {
  const sectionName = "property";
  const tester = SectionQueryTester.init({
    sectionName,
    indexName: "property",
  });
  return tester.makeSectionPackReq();
}

const apiRoute = apiQueriesShared.addSection.pathRoute;
describe(apiRoute, () => {
  let req: NextReq<"addSection">;
  let server: Server;
  let userId: string;
  let token: string;

  beforeEach(async () => {
    server = runApp();
    userId = await createTestUserModelNext(apiRoute);
    token = DbUser.makeUserAuthToken(userId);
    req = makeAddSectionReq();
  });

  afterEach(async () => {
    await UserModel.deleteOne({ _id: userId });
    server.close();
  });

  const exec = async () =>
    await request(server)
      .post(apiRoute)
      .set(config.tokenKey.apiUserAuth, token)
      .send(req.body);

  async function testStatus(statusNumber: number) {
    const res = await exec();
    expect(res.status).toBe(statusNumber);
    return res;
  }
  it("should return 200 and add the section if happy path", async () => {
    const preDoc = await getUserByIdNoRes(userId);
    await testStatus(200);
    const postDoc = await getUserByIdNoRes(userId);

    expect(postDoc.property.length).toBe(preDoc.property.length + 1);
    expect(Arr.lastOrThrow(postDoc.property).dbId).toBe(
      req.body.sectionPack.dbId
    );
  });
  it("should return 401 if client is not logged in", async () => {
    token = "" as any;
    await testStatus(401);
  });
  it("should return 500 if sectionPack is not an object", async () => {
    req.body.sectionPack = null as any;
    await testStatus(500);
  });
  it("should return 500 if there is already an entry in the db with the sectionPack's dbId", async () => {
    await exec();
    await testStatus(500);
  });
});
