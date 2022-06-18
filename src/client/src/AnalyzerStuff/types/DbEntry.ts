import { DbValue } from "../../App/sharedWithServer/SectionsMeta/relSections/rel/valueMetaTypes";
import { SectionName } from "../../App/sharedWithServer/SectionsMeta/SectionName";

export type DbVarbs = {
  [varbName: string]: DbValue;
};
export type ChildDbIds = {
  [sectionName: string]: string[];
};
export type DbSection = {
  dbId: string;
  dbVarbs: DbVarbs;
  childDbIds: ChildDbIds;
};
type FullDbSections = Record<SectionName | SectionName<"dbStore">, DbSection[]>;
export type DbSections = Partial<FullDbSections>;
export type DbEntry = {
  dbId: string;
  dbSections: DbSections;
};