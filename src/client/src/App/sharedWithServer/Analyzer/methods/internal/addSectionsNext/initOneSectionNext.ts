import Analyzer from "../../../../Analyzer";
import { FeInfo, InfoS } from "../../../../SectionMetas/Info";
import {
  SectionName,
  sectionNameS,
} from "../../../../SectionMetas/SectionName";
import StateSection from "../../../StateSection";
import { AddSectionPropsNext } from "../addSections/addSectionsTypes";

export function initOneSectionNext(
  next: Analyzer,
  { idx, ...props }: AddSectionPropsNext
): Analyzer {
  next = pushSection(next, StateSection.initNext(props));
  const { sectionName } = props;
  const { feInfo } = next.lastSection(sectionName);
  if (sectionNameS.is(sectionName, "hasParent"))
    next = addToParentChildIds(next, feInfo, idx);
  return next;
}

function pushSection<S extends SectionName>(
  analyzer: Analyzer,
  section: StateSection<S>
): Analyzer {
  const { sectionName } = section.meta.core;
  const nextSectionArr = [
    ...analyzer.sections[sectionName],
    section,
  ] as StateSection[];
  return analyzer.updateSectionArr(sectionName, nextSectionArr);
}

function addToParentChildIds(
  analyzer: Analyzer,
  feInfo: FeInfo,
  idx?: number
): Analyzer {
  if (!InfoS.is.fe(feInfo, "hasParent")) return analyzer;
  const parentSection = analyzer.parent(feInfo);
  const nextParent = parentSection.addChildFeId(feInfo, idx);
  return analyzer.updateSection(nextParent);
}
