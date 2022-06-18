import { SectionFinder } from "../../../../../App/sharedWithServer/SectionsMeta/baseSectionTypes";
import { FeInfo } from "../../../../../App/sharedWithServer/SectionsMeta/Info";
import {
  SectionName,
  sectionNameS,
  SectionNameType,
} from "../../../../../App/sharedWithServer/SectionsMeta/SectionName";
import { DbEntry, DbSection, DbSections } from "../../../../types/DbEntry";
import Analyzer from "../../../Analyzer";

type StateToDbSectionsOptions = {
  newMainSectionName?: SectionName;
  skipSectionNames?: string[];
  includeInEntitySections?: boolean;
};
type toDbEntryOptions = StateToDbSectionsOptions;

// depreciated
function getDbSection(analyzer: Analyzer, feInfo: FeInfo): DbSection {
  const childDbIds = analyzer.allChildDbIds(feInfo);
  const { dbVarbs, dbId } = analyzer.section(feInfo);
  return {
    dbId,
    dbVarbs,
    childDbIds,
  };
}
function dbSectionAndChildren(
  analyzer: Analyzer,
  info: SectionFinder,
  {
    newMainSectionName,
    skipSectionNames = [],
    includeInEntitySections,
  }: StateToDbSectionsOptions = {}
): DbSections {
  const mainSectionName = analyzer.section(info).sectionName;
  const feInfos = analyzer.nestedFeInfos(info, {
    includeInEntitySections,
    skipSectionNames,
  });

  function getSectionName({ sectionName }: FeInfo) {
    if (sectionName === mainSectionName && newMainSectionName !== undefined)
      return newMainSectionName;
    else return sectionName;
  }

  return feInfos.reduce((dbSections, feInfo) => {
    const sectionName = getSectionName(feInfo);

    const dbSection = getDbSection(analyzer, feInfo);
    const secs = dbSections[sectionName] ?? [];
    secs.push(dbSection);
    dbSections[sectionName] = secs;
    return dbSections;
  }, {} as DbSections);
}

export function dbEntry(
  this: Analyzer,
  finder: SectionFinder,
  options: toDbEntryOptions = {}
): DbEntry {
  return {
    dbId: this.section(finder).dbId,
    dbSections: dbSectionAndChildren(this, finder, options),
  };
}

export function dbEntryArr(
  this: Analyzer,
  sectionName: SectionName
): DbEntry[] {
  const feInfos = this.sectionArrInfos(sectionName);
  return feInfos.map((feInfo) => this.dbEntry(feInfo));
}

export function dbEntryArrs<
  ST extends SectionNameType,
  ToReturn = { [Prop in SectionName<ST & SectionNameType>]: DbEntry[] }
>(this: Analyzer, sectionNameType: ST): ToReturn {
  const partial = {} as ToReturn;
  for (const sectionName of sectionNameS.arrs[sectionNameType]) {
    partial[sectionName as keyof typeof partial] = this.dbEntryArr(
      sectionName as any
    ) as any;
  }
  return partial as ToReturn;
}