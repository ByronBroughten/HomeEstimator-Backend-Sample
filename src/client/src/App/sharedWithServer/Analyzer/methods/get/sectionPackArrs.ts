import Analyzer from "../../../Analyzer";
import {
  SectionName,
  sectionNameS,
  SectionNameType,
} from "../../../SectionsMeta/SectionName";
import { Obj } from "../../../utils/Obj";
import { FeSectionPack } from "../../FeSectionPack";
import { SectionPackRaw } from "../../SectionPackRaw";

export function makeRawSectionPackArr<SN extends SectionName>(
  this: Analyzer,
  sectionName: SN
): SectionPackRaw<SN>[] {
  const feInfos = this.sectionArrInfos(sectionName);
  return feInfos.map((feInfo) => this.makeRawSectionPack(feInfo));
}

type FeSectionPackArrs<ST extends SectionNameType> = {
  [SN in SectionName<ST & SectionNameType>]: SectionPackRaw<SN>[];
};
export function makeRawSectionPackArrs<ST extends SectionNameType>(
  this: Analyzer,
  sectionNameType: ST
): FeSectionPackArrs<ST> {
  return (sectionNameS.arrs[sectionNameType] as string[]).reduce(
    (sectionPackArrs, sectionName) => {
      sectionPackArrs[sectionName as keyof typeof sectionPackArrs] =
        this.makeRawSectionPackArr(sectionName as SectionName<ST>) as any;
      return sectionPackArrs;
    },
    {} as FeSectionPackArrs<ST>
  );
}

type DbSectionPackArrs<ST extends SectionNameType> = {
  [SN in SectionName<ST & SectionNameType>]: SectionPackRaw<SN>[];
};
// For this to work, all guestAccessStore sections much be identical accross client and server.
export function guestAccessDbSectionPacks(
  this: Analyzer
): DbSectionPackArrs<"feGuestAccess"> {
  const feSectionPackArrs = this.makeRawSectionPackArrs("feGuestAccess");
  const dbSectionPackArrs = Obj.entries(feSectionPackArrs).reduce(
    (dbSectionPackArrs, [sectionName, feRawPacks]) => {
      const dbRawPacks = feRawPacks.map((feRawPack) => {
        const dbRawPack = (
          FeSectionPack.rawFeToServer as (
            feRawPack: any,
            sectionName: any
          ) => any
        )(feRawPack, sectionName);
        return dbRawPack as SectionPackRaw<typeof sectionName>;
      });
      (dbSectionPackArrs[sectionName] as any) =
        dbRawPacks as typeof dbSectionPackArrs[typeof sectionName];
      return dbSectionPackArrs;
    },
    {} as DbSectionPackArrs<"feGuestAccess">
  );
  return dbSectionPackArrs;
}
