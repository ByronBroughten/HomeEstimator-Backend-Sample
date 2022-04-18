import urljoin from "url-join";
import { config } from "../Constants";
import Analyzer from "./Analyzer";
import {
  makeDbIdSectionPackReq,
  makeRawSectionPackArrReq,
  makeRawSectionPackReq,
} from "./apiQueriesShared/makeGeneralReqs";
import { ApiQueryName, NextReq } from "./apiQueriesSharedTypes";

const makeApiReqs = makeReqMakers();
const apiPaths = makeEndpointPaths();
export const apiQueriesShared = makeApiQueriesShared();

function makeApiQueriesShared() {
  return config.apiQueryNames.reduce((partial, queryName) => {
    (partial[queryName] as any) = new ApiQueryShared(queryName);
    return partial;
  }, {} as ApiQueriesShared);
}

type ApiQueriesShared = {
  [QN in ApiQueryName]: ApiQueryShared<QN>;
};

class ApiQueryShared<QN extends ApiQueryName> {
  constructor(readonly queryName: QN) {}
  get makeReq() {
    return makeApiReqs[this.queryName];
  }
  get path() {
    return apiPaths[this.queryName];
  }
}

function makeReqMakers() {
  return {
    upgradeUserToPro: (
      paymentMethodId: string
    ): NextReq<"upgradeUserToPro"> => ({
      body: { paymentMethodId },
    }),
    nextRegister: (analyzer: Analyzer): NextReq<"nextRegister"> => ({
      body: {
        payload: {
          registerFormData: analyzer.section("register").values({
            userName: "string",
            email: "string",
            password: "string",
          }),
          guestAccessSections: analyzer.guestAccessDbSectionPacks(),
        },
      },
    }),
    nextLogin: (analyzer: Analyzer): NextReq<"nextLogin"> => ({
      body: {
        payload: analyzer.section("login").values({
          email: "string",
          password: "string",
        }),
      },
    }),
    get addSection() {
      return makeRawSectionPackReq;
    },
    get updateSection() {
      return makeRawSectionPackReq;
    },
    get getSection() {
      return makeDbIdSectionPackReq;
    },
    get deleteSection() {
      return makeDbIdSectionPackReq;
    },
    get replaceSectionArr() {
      return makeRawSectionPackArrReq;
    },
  } as const;
}

export type MakeApiReqs = typeof makeApiReqs;
type MakeApiReqsGeneral = {
  [QN in ApiQueryName]: (props: any) => NextReq<QN>;
};
type TestMakeApiReqs<T extends MakeApiReqsGeneral> = T;
type _TestMakeApiReqs = TestMakeApiReqs<MakeApiReqs>;

function makeEndpointPaths() {
  const baseEndpointBit = config.apiEndpointBase;
  const basePaths: BitRouteAndPath = {
    bit: `/${baseEndpointBit}`,
    get route() {
      return this.bit;
    },
    get full() {
      return urljoin(baseEndpointBit, this.bit);
    },
  } as const;
  return config.apiQueryNames.reduce((endpoints, queryName) => {
    endpoints[queryName] = bitRouteAndPath(basePaths, `/${queryName}`);
    return endpoints;
  }, {} as { [QN in typeof config.apiQueryNames[number]]: BitRouteAndPath });
}
type BitRouteAndPath = { bit: string; route: string; full: string };
function bitRouteAndPath(
  basePaths: BitRouteAndPath,
  pathBit: string
): BitRouteAndPath {
  return {
    bit: pathBit,
    get route() {
      return urljoin(basePaths.route, this.bit);
    },
    get full() {
      return urljoin(basePaths.full, this.route);
    },
  };
}
