import { baseSections, SimpleSectionName } from "../baseSections";
import { StateValue } from "../baseSectionsUtils/baseValues/StateValueTypes";
import { ValueName } from "../baseSectionsUtils/baseVarb";
import { BaseVarbSchemas } from "../baseSectionsUtils/baseVarbs";
import { BaseSectionVarbs, SectionVarbName } from "./baseSectionTypes";
import { VarbNamesNext } from "./baseVarbInfo";
import { valueMeta } from "./valueMeta";

export type ValueSchemas = typeof valueMeta;
export type ValueNamesToTypes = {
  [VN in ValueName]: ReturnType<ValueSchemas[VN]["initDefault"]>;
};

export type SectionValues<SN extends SimpleSectionName> = {
  [VN in SectionVarbName<SN>]: ValueNamesToTypes[BaseSectionVarbs<SN>[VN] &
    keyof ValueNamesToTypes];
};

export type VarbValue<
  SN extends SimpleSectionName,
  VN extends SectionVarbName<SN>
> = SectionValues<SN>[VN];
export function isVarbValue<
  SN extends SimpleSectionName,
  VN extends SectionVarbName<SN>
>(
  value: any,
  { sectionName, varbName }: VarbNamesNext<SN, VN>
): value is VarbValue<SN, VN> {
  const varbSchemas = baseSections[sectionName].varbSchemas as BaseVarbSchemas;
  const valueName = varbSchemas[varbName as string];
  return valueMeta[valueName].is(value);
}

export type SectionValuesReq = {
  [varbName: string]: ValueName;
};
export type SectionValuesRes<VNS extends SectionValuesReq> = {
  [VN in keyof VNS]: ValueNamesToTypes[VNS[VN]];
};

export type DbValue = StateValue;

export type UpdateFnName =
  ValueSchemas[keyof ValueSchemas]["updateFnNames"][number];