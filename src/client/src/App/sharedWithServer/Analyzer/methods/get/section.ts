import Analyzer from "../../../Analyzer";
import { SectionFinder } from "../../../SectionsMeta/baseSectionTypes";
import { InfoS } from "../../../SectionsMeta/Info";
import {
  FeNameInfo,
  FeVarbInfo,
  MultiFindByFocalInfo,
  MultiSectionInfo,
  SpecificSectionInfo,
  SpecificSectionsInfo,
} from "../../../SectionsMeta/relSections/rel/relVarbInfoTypes";
import { SectionName } from "../../../SectionsMeta/SectionName";
import { Arr } from "../../../utils/Arr";
import { Obj } from "../../../utils/Obj";
import StateSection from "../../StateSection";

export function sectionNotFound({ sectionName, idType, id }: MultiSectionInfo) {
  return new Error(
    `There is no section with name ${sectionName} and ${idType} ${id}`
  );
}

export function section<S extends SectionName<"alwaysOne">>(
  this: Analyzer,
  finder: S
): StateSection<S>;
export function section<I extends SpecificSectionInfo>(
  this: Analyzer,
  finder: I
): StateSection<I["sectionName"]>;
export function section<
  S extends SectionName<"alwaysOne">,
  I extends SpecificSectionInfo
>(
  this: Analyzer, // you have to specify the union overload.
  finder: S | I
): StateSection<S | I["sectionName"]>;
export function section<S extends SectionName>(
  this: Analyzer,
  finder: SectionFinder<S>
): StateSection<S> {
  if (typeof finder === "string")
    return this.singleSection(finder) as any as StateSection<S>;
  const section = this.findSection(finder);
  if (section) return section;
  else {
    throw new Error(`Section not found using: ${JSON.stringify(finder)}`);
  }
}

export function updateSection(
  this: Analyzer,
  nextSection: StateSection
): Analyzer {
  const { sectionName } = nextSection;
  const sectionArr = this.sectionArr(sectionName);
  const idx = sectionArr.findIndex(({ feId }) => feId === nextSection.feId);
  if (idx === -1) throw Analyzer.sectionNotFound(nextSection.feInfo);
  const nextSectionArr = Arr.replaceAtIdxClone(sectionArr, nextSection, idx);
  return this.updateSectionArr(sectionName, nextSectionArr);
}

export function feSection<S extends SectionName>(
  this: Analyzer,
  sectionName: S,
  feId: string
): StateSection<S> {
  const feInfo = InfoS.fe(sectionName, feId);
  return this.section(feInfo);
}

export function singleSection<S extends SectionName<"alwaysOne">>(
  this: Analyzer,
  sectionName: S
): StateSection<S> {
  if (this.meta.section(sectionName).get("alwaysOne"))
    return this.firstSection(sectionName);
  else throw new Error(`"${sectionName}" is not a static section.`);
}
export function firstSection<S extends SectionName>(
  this: Analyzer,
  sectionName: S
): StateSection<S> {
  const section = Object.values(
    this.sections[sectionName]
  )[0] as StateSection<S>;
  if (!section) {
    throw new Error(`Section with name '${sectionName}' has no entries.`);
  }
  return section;
}
export function lastSection<SN extends SectionName>(
  this: Analyzer,
  sectionName: SN
): StateSection<SN> {
  const sectionArr = Obj.values(this.sections[sectionName]);
  const section = sectionArr[sectionArr.length - 1];
  return section as any as StateSection<SN>;
}
// Do I update the infos and whatnot to require a sectionName?
// I'm leaning towards yes.
export function sectionByFocal<I extends MultiFindByFocalInfo>(
  this: Analyzer,
  focalInfo: SpecificSectionInfo,
  info: I
): StateSection<I["sectionName"]> {
  const section = this.findSectionByFocal(focalInfo, info);
  if (section) return section;
  else throw sectionNotFound(info);
}
export function sectionsByFocal<I extends MultiSectionInfo>(
  this: Analyzer,
  focalInfo: SpecificSectionInfo,
  info: I
): StateSection<I["sectionName"]>[] {
  const sections = this.findSectionsByFocal(focalInfo, info);
  if (sections) return sections;
  else throw sectionNotFound(info);
}
export function hasSection(
  this: Analyzer,
  info: SpecificSectionsInfo
): boolean {
  return this.findSections(info).length !== 0;
}

export function sectionOutFeVarbInfos(
  this: Analyzer,
  feInfo: FeNameInfo
): FeVarbInfo[] {
  let outVarbInfos: FeVarbInfo[] = [];
  for (const varbName in this.section(feInfo).varbs) {
    outVarbInfos = outVarbInfos.concat(
      this.outVarbInfos(InfoS.feVarb(varbName, feInfo))
    );
  }
  return outVarbInfos;
}
