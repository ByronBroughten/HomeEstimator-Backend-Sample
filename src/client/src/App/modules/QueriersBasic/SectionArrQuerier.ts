import { FeSectionPack } from "../../sharedWithServer/Analyzer/FeSectionPack";
import { SectionPackRaw } from "../../sharedWithServer/SectionPack/SectionPackRaw";
import { SavableSectionName } from "../../sharedWithServer/SectionsMeta/relNameArrs/storeArrs";
import { makeReq } from "./../../sharedWithServer/apiQueriesShared/makeGeneralReqs";
import { ApiQuerierBase, ApiQuerierBaseProps } from "./Bases/ApiQuerierBase";

interface SectionArrQuerierProps<SN extends SavableSectionName<"arrStore">>
  extends ApiQuerierBaseProps {
  sectionName: SN;
}

export class SectionArrQuerier<
  SN extends SavableSectionName<"arrStore">
> extends ApiQuerierBase {
  readonly sectionName: SN;
  constructor({ sectionName, ...rest }: SectionArrQuerierProps<SN>) {
    super(rest);
    this.sectionName = sectionName;
  }

  async replace(feSectionPackArr: SectionPackRaw<SN>[]): Promise<SN> {
    const serverSectionPackArr = feSectionPackArr.map((rawPack) =>
      FeSectionPack.rawFeToServer(rawPack, this.sectionName as any)
    );
    const req = makeReq({
      dbStoreName: this.sectionName,
      sectionPackArr: serverSectionPackArr,
    } as const);
    const res = await this.apiQueries.replaceSectionArr(req);
    return res.data.dbStoreName as SN;
  }
}
