import { Req } from "../User/crudTypes";
import Analyzer from "./../Analyzer";
import { FeInfo } from "./SectionMetas/Info";

export type AnalyzerReq = typeof analyzerReq;
export const analyzerReq = {
  register(analyzer: Analyzer): Req<"Register"> {
    return {
      body: {
        payload: {
          registerFormData: analyzer.section("register").values({
            userName: "string",
            email: "string",
            password: "string",
          }),
          guestAccessSections: analyzer.dbEntryArrs("feGuestAccessStore"),
        },
      },
    };
  },
  login(analyzer: Analyzer): Req<"Login"> {
    return {
      body: {
        payload: analyzer.section("login").values({
          email: "string",
          password: "string",
        }),
      },
    };
  },
  postIndexEntry(
    analyzer: Analyzer,
    feInfo: FeInfo<"hasIndexStore">
  ): Req<"PostEntry"> {
    const { indexStoreName } = analyzer.sectionMeta(feInfo.sectionName);
    const dbEntry = analyzer.dbIndexEntry(feInfo);
    return {
      body: {
        dbStoreName: indexStoreName,
        payload: dbEntry,
      },
    };
  },
} as const;
