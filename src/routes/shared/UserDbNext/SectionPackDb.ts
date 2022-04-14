import { z } from "zod";
import { SelfOrDescendantName } from "../../../client/src/App/sharedWithServer/Analyzer/SectionMetas/relNameArrs/ChildTypes";
import { InEntityVarbInfo } from "../../../client/src/App/sharedWithServer/Analyzer/SectionMetas/relSections/baseSections/baseValues/NumObj/entities";
import {
  SectionNam,
  SectionName,
  SectionNameType,
} from "../../../client/src/App/sharedWithServer/Analyzer/SectionMetas/SectionName";
import {
  SectionPackDbRaw,
  SectionPackRaw,
} from "../../../client/src/App/sharedWithServer/Analyzer/SectionPackRaw";
import {
  RawSection,
  zRawSections,
} from "../../../client/src/App/sharedWithServer/Analyzer/SectionPackRaw/RawSection";
import { zodSchema } from "../../../client/src/App/sharedWithServer/utils/zod";

export class SectionPackDb<SN extends SectionName> {
  constructor(readonly core: SectionPackDbRaw<SN> & { sectionName: SN }) {}
  get sectionName() {
    return this.core.sectionName;
  }
  get dbId() {
    return this.core.dbId;
  }
  value(info: InEntityVarbInfo) {}
  rawSectionArr<SDN extends SelfOrDescendantName<SN, "db">>(
    sectionName: SDN
  ): RawSection<"db", SDN>[] {
    return this.core.rawSections[sectionName] as RawSection<"db", SDN>[];
  }
  headSection(): RawSection<"db", SN> {
    return this.firstSection(this.sectionName);
  }
  firstSection<SDN extends SelfOrDescendantName<SN, "db">>(
    sectionName: SDN
  ): RawSection<"db", SDN> {
    const rawSection = this.rawSectionArr(sectionName)[0];
    if (rawSection) return rawSection;
    else
      throw new Error(
        `No raw section was found at this.core.rawSections[${sectionName}]`
      );
  }
  isSectionType<ST extends SectionNameType<"db">>(
    sectionType: ST
  ): this is SectionPackDb<SectionName<ST>> {
    if (SectionNam.is(this.sectionName, sectionType)) return true;
    else return false;
  }
  toFeSectionPack(): SectionPackRaw<"fe", SN> {
    if (this.isSectionType("normalDbStore") || this.isSectionType("table")) {
      // the as intermediary is there due to excessive stack depth
      return { ...this.core, contextName: "fe" } as Record<
        keyof SectionPackRaw<"fe", SN>,
        any
      > as SectionPackRaw<"fe", SN>;
    } else {
      throw new Error(
        `SectionPackDb.toFeSectionPack doesn't work with SectionPackDb of sectionName ${this.sectionName}`
      );
    }
  }
}

const zDbSectionPackFrame: Record<keyof SectionPackDbRaw, any> = {
  dbId: zodSchema.nanoId,
  rawSections: zRawSections,
};
const zDbSectionPack = z.object(zDbSectionPackFrame);
export const zDbSectionPackArr = z.array(zDbSectionPack);