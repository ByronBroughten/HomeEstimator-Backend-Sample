import urljoin from "url-join";
import { config } from "../Constants";
import { makeResValidationQueryError } from "../modules/useQueryActions/apiQueriesClient/validateRes";
import Analyzer from "./Analyzer";
import { FeSectionPack } from "./Analyzer/FeSectionPack";
import {
  ApiQueryName,
  NextReq,
  NextRes,
} from "./apiQueriesShared/apiQueriesSharedTypes";
import { isLoginHeaders, isLoginUserNext } from "./apiQueriesShared/login";
import {
  makeDbIdSectionPackReq,
  makeRawSectionPackArrReq,
  makeRawSectionPackReq,
  makeReq,
  SectionPackReq,
} from "./apiQueriesShared/makeGeneralReqs";
import { StoredSectionPackInfo } from "./SectionPack/SectionPackRaw";
import { SectionFinder } from "./SectionsMeta/baseSectionTypes";
import { SavableSectionName } from "./SectionsMeta/relNameArrs/storeArrs";

const makeApiReqs = makeReqMakers();
const apiPaths = makeApiPaths();

class ApiQueryShared<QN extends ApiQueryName> {
  constructor(readonly queryName: QN) {}
  get makeReq() {
    return makeApiReqs[this.queryName];
  }
  get pathBit() {
    return this.path.bit;
  }
  get pathRoute() {
    return this.path.route;
  }
  get pathFull() {
    return this.path.full;
  }
  private get path() {
    return apiPaths[this.queryName];
  }
}

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

export const resValidators = {
  nextRegister: (res: any): NextRes<"nextRegister"> => {
    if (res && isLoginUserNext(res.data) && isLoginHeaders(res.headers)) {
      return {
        data: res.data,
        headers: res.headers,
      };
    } else throw makeResValidationQueryError();
  },
};

export class ReqMaker {
  constructor(private sections: Analyzer = Analyzer.initAnalyzer()) {}
  sectionPackArr<DN extends SavableSectionName<"arrStore">>(sectionName: DN) {
    const rawSectionPackArr = this.sections.makeRawSectionPackArr(sectionName);
    return makeReq({
      dbStoreName: sectionName,
      sectionPackArr: rawSectionPackArr.map((rawPack) =>
        FeSectionPack.rawFeToServer(rawPack, sectionName as any)
      ),
    });
  }
  nextRegister(): NextReq<"nextRegister"> {
    return makeReq({
      registerFormData: this.sections.section("register").values({
        userName: "string",
        email: "string",
        password: "string",
      }),
      guestAccessSections: this.sections.guestAccessDbSectionPacks(),
    });
  }
  nextLogin(): NextReq<"nextLogin"> {
    return makeReq(
      this.sections.section("login").values({
        email: "string",
        password: "string",
      })
    );
  }
  sectionPack(
    finder: SectionFinder<SavableSectionName<"indexStore">>
  ): SectionPackReq {
    const sectionPack = this.sections.makeRawSectionPack(finder);
    const { sectionName } = sectionPack;
    return makeReq({
      sectionPack: FeSectionPack.rawFeToServer(sectionPack, sectionName),
    });
  }
  sectionPackInfo(spInfo: StoredSectionPackInfo) {
    return makeReq(spInfo);
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
        registerFormData: analyzer.section("register").values({
          userName: "string",
          email: "string",
          password: "string",
        }),
        guestAccessSections: analyzer.guestAccessDbSectionPacks(),
      },
    }),
    nextLogin: (analyzer: Analyzer): NextReq<"nextLogin"> =>
      makeReq(
        analyzer.section("login").values({
          email: "string",
          password: "string",
        })
      ),
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

function makeApiPaths() {
  return config.apiQueryNames.reduce((endpoints, queryName) => {
    endpoints[queryName] = bitRouteAndPath(`/${queryName}`);
    return endpoints;
  }, {} as { [QN in typeof config.apiQueryNames[number]]: BitRouteAndPath });
}
type BitRouteAndPath = { bit: string; route: string; full: string };
function bitRouteAndPath(pathBit: string): BitRouteAndPath {
  return {
    bit: pathBit,
    get route() {
      return urljoin(config.apiPathBit, this.bit);
    },
    get full() {
      return urljoin(config.apiPathFull, this.bit);
    },
  };
}
