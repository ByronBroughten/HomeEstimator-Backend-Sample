import { SectionName, sectionNames } from "../sectionVarbsConfig/SectionName";
import {
  AllBaseSectionVarbs,
  allBaseSectionVarbs,
} from "../sectionVarbsConfig/allBaseSectionVarbs";
import { GeneralBaseSectionVarbs } from "../sectionVarbsConfig/allBaseSectionVarbs/baseSectionVarbs";
import {
  AllSectionTraits,
  allSectionTraits,
} from "../sectionVarbsConfig/allSectionTraits";
import {
  GeneralSectionTraits,
  SectionTraitName,
} from "../sectionVarbsConfig/allSectionTraits/sectionTraits";
import {
  AllUpdateSections,
  allUpdateSections,
} from "../sectionVarbsConfig/allUpdateSectionVarbs";
import { GeneralUpdateSectionVarbs } from "../sectionVarbsConfig/allUpdateSectionVarbs/updateSectionVarbs";
import {
  SectionToParentNameArrs,
  sectionParentNames,
} from "../sectionVarbsConfigDerived/sectionChildrenDerived/ParentName";

type SectionMetaCoreGeneral = {
  baseVarbs: GeneralBaseSectionVarbs;
  relVarbs: GeneralUpdateSectionVarbs;
} & GeneralGeneratedSection &
  GeneralSectionTraits;

type SectionMetasCoreGeneral = {
  [SN in SectionName]: SectionMetaCoreGeneral;
};

export type SectionsMetaCore = {
  [SN in SectionName]: SectionMetaCore<SN>;
};
type SectionMetaCore<SN extends SectionName> = {
  baseVarbs: AllBaseSectionVarbs[SN];
  relVarbs: AllUpdateSections[SN];
} & GeneratedSections[SN] &
  AllSectionTraits[SN];

export type GeneralGeneratedSection = {
  parentNames: string[];
};
type GeneratedSection<SN extends SectionName> = {
  parentNames: SectionToParentNameArrs[SN];
};
export type GenPropName = keyof GeneratedSection<SectionName>;

type GeneralGeneratedSections = {
  [SN in SectionName]: GeneralGeneratedSection;
};
export type GeneratedSections = {
  [SN in SectionName]: GeneratedSection<SN>;
};

export const generatedSections = sectionNames.reduce(
  (generatedSections, sectionName) => {
    generatedSections[sectionName] = {
      parentNames: sectionParentNames[sectionName],
    };
    return generatedSections;
  },
  {} as GeneralGeneratedSections
) as GeneratedSections;

export const sectionMetasCore = sectionNames.reduce((core, sectionName) => {
  (core as SectionMetasCoreGeneral)[sectionName] = {
    ...{
      baseVarbs: allBaseSectionVarbs[sectionName],
      relVarbs: allUpdateSections[sectionName],
    },
    ...({
      ...generatedSections[sectionName],
      ...allSectionTraits[sectionName],
    } as any),
  } as any;
  return core;
}, {} as SectionsMetaCore);

export type CorePropName = GenPropName | SectionTraitName;
