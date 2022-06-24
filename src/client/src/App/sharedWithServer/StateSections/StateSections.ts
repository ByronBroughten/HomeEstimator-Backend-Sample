import { pick } from "lodash";
import { Id } from "../SectionsMeta/baseSections/id";
import { FeSectionInfo, VarbInfo } from "../SectionsMeta/Info";
import { SectionName, sectionNameS } from "../SectionsMeta/SectionName";
import { Arr } from "../utils/Arr";
import { Obj } from "../utils/Obj";
import { initRawSection, initRawVarbs } from "./initRawSection";
import {
  RawFeSection,
  RawFeSections,
  RawFeVarb,
  RawSectionListProps,
  SectionNotFoundError,
} from "./StateSectionsTypes";

type UpdateVarbProps<SN extends SectionName> = {
  feVarbInfo: VarbInfo<SN>;
  rawVarb: RawFeVarb<SN>;
};

export class StateSections {
  constructor(private core: RawFeSections) {}
  get rawSections(): RawFeSections {
    return this.core;
  }
  rawSectionList<SN extends SectionName>(sectionName: SN): RawFeSection<SN>[] {
    const test = this.core[sectionName];
    return test as RawFeSection<SN>[];
  }
  sectionIdx<SN extends SectionName>(feInfo: FeSectionInfo<SN>): number {
    const sectionList = this.rawSectionList(feInfo.sectionName);
    return Arr.idxOrThrow(
      sectionList,
      (section) => section.feId === feInfo.feId
    );
  }
  hasSection(feInfo: FeSectionInfo): boolean {
    try {
      this.sectionIdx(feInfo);
      return true;
    } catch (error) {
      if (error instanceof SectionNotFoundError) return false;
      else throw error;
    }
  }

  onlyOneRawSection<SN extends SectionName>(sectionName: SN): RawFeSection<SN> {
    const sectionList = this.rawSectionList(sectionName);
    if (sectionList.length !== 1) {
      throw new Error(`There should only be one "${sectionName}" section.`);
    }
    return sectionList[0];
  }
  get mainRawSection(): RawFeSection<"main"> {
    return this.onlyOneRawSection("main");
  }
  get mainSectionInfo(): FeSectionInfo<"main"> {
    return pick(this.mainRawSection, ["sectionName", "feId"]);
  }
  rawSection<SN extends SectionName>(
    feInfo: FeSectionInfo<SN>
  ): RawFeSection<SN> {
    const idx = this.sectionIdx(feInfo);
    return this.rawSectionList(feInfo.sectionName)[idx];
  }
  rawVarb<SN extends SectionName>({
    varbName,
    ...rest
  }: VarbInfo<SN>): RawFeVarb<SN> {
    return this.rawSection(rest).varbs[varbName];
  }
  updateSectionLists(lists: Partial<RawFeSections>): StateSections {
    return new StateSections({
      ...this.core,
      ...lists,
    });
  }
  updateSectionList<SN extends SectionName>({
    sectionName,
    list,
  }: RawSectionListProps<SN>): StateSections {
    return this.updateSectionLists({
      [sectionName]: list,
    });
  }
  updateSection<SN extends SectionName>(
    rawSection: RawFeSection<SN>
  ): StateSections {
    const { sectionName } = rawSection;
    const nextList = [...this.rawSectionList(sectionName)];
    const idx = this.sectionIdx(rawSection);
    nextList[idx] = rawSection;
    return this.updateSectionList({
      sectionName,
      list: nextList,
    });
  }
  updateVarb<SN extends SectionName>({
    feVarbInfo: { varbName, ...feSectionInfo },
    rawVarb,
  }: UpdateVarbProps<SN>): StateSections {
    const section = this.rawSection(feSectionInfo);
    const nextVarbs = { ...section.varbs };
    return this.updateSection({
      ...section,
      varbs: Obj.updateIfPropExists({
        obj: nextVarbs,
        key: varbName,
        val: rawVarb,
      }),
    });
  }
  static initRawSection = initRawSection;
  static initRawVarbs = initRawVarbs;
  static initWithRoot(): StateSections {
    const rootSection = StateSections.initRawSection({
      sectionName: "root",
      feId: Id.make(),
    });
    const sections = this.initEmpty();
    return sections.updateSectionList({
      sectionName: "root",
      list: [rootSection],
    });
  }

  static initEmpty(): StateSections {
    return new StateSections(this.emptyRawSections());
  }
  static emptyRawSections(): RawFeSections {
    return sectionNameS.arrs.all.reduce((core, sectionName) => {
      core[sectionName] = [];
      return core;
    }, {} as { -readonly [SN in keyof RawFeSections]: RawFeSections[SN] });
  }
}