import {
  getVarbPathParams,
  VarbPathNameProp,
  VarbPathParams,
} from "../SectionsMeta/SectionInfo/VarbPathNameInfo";
import {
  DealMode,
  getDealModes,
} from "../SectionsMeta/values/StateValue/dealMode";
import {
  fixedVarbPathNames,
  ValueFixedVarbPathName,
} from "./ValueInEntityInfo";

export type VarbPathArrParam<
  VPN extends ValueFixedVarbPathName = ValueFixedVarbPathName
> = VarbPathParams<VPN> & VarbPathNameProp<VPN>;

export const fixedVarbOptionArrs = getDealModes("plusMixed").reduce(
  (obj, dealMode) => {
    obj[dealMode] = fixedVarbPathNames[dealMode].map(
      (varbPathName) =>
        ({
          varbPathName,
          ...getVarbPathParams(varbPathName),
        } as VarbPathArrParam)
    );
    return obj;
  },
  {} as Record<DealMode<"plusMixed">, VarbPathArrParam[]>
);
