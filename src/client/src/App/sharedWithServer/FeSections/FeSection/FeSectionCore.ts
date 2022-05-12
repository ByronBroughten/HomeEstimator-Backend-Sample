import { pick } from "lodash";
import { DbVarbs } from "../../Analyzer/SectionPackRaw/RawSection";
import { sectionMetas } from "../../SectionMetas";
import { Id } from "../../SectionMetas/baseSections/id";
import {
  ChildIdArrs,
  OneChildIdArrs,
} from "../../SectionMetas/relSectionTypes/ChildTypes";
import { FeParentInfo } from "../../SectionMetas/relSectionTypes/ParentTypes";
import { SectionName } from "../../SectionMetas/SectionName";
import { FeVarbsI, initFeVarbs } from "./FeVarbs";

export class HasFeSectionCore<SN extends SectionName> {
  constructor(readonly core: FeSectionCore<SN>) {}
}

export type FeSectionCore<SN extends SectionName> = {
  feId: string;
  parentInfo: FeParentInfo<SN>;
  sectionName: SN;
  dbId: string;
  varbs: FeVarbsI<SN>;
  childFeIds: OneChildIdArrs<SN, "fe">;
};

export type InitFeSectionCoreProps<SN extends SectionName> = {
  sectionName: SN;
  parentInfo: FeParentInfo<SN>;
  feId?: string;
  childFeIds?: Partial<OneChildIdArrs<SN, "fe">>; // empty
  dbId?: string; // create new
  dbVarbs?: Partial<DbVarbs>; // empty
};
// there are no varbs
export function initFeSectionCore<SN extends SectionName>({
  sectionName,
  feId = Id.make(),
  childFeIds = {},
  dbVarbs = {},
  ...rest
}: InitFeSectionCoreProps<SN>): FeSectionCore<SN> {
  return {
    ...rest,
    sectionName,
    feId,
    dbId: Id.make(),
    childFeIds: initChildFeIds(sectionName, childFeIds),
    varbs: initFeVarbs({
      sectionName,
      feId,
      dbVarbs,
    }),
  };
}

function initChildFeIds<SN extends SectionName>(
  sectionName: SN,
  proposed: Partial<ChildIdArrs<SN>> = {}
): OneChildIdArrs<SN, "fe"> {
  const sectionMeta = sectionMetas.section(sectionName, "fe");
  return {
    ...sectionMeta.emptyChildIds(),
    ...pick(proposed, [
      sectionMeta.get("childNames") as any as keyof ChildIdArrs<SN>,
    ]),
  };
}
