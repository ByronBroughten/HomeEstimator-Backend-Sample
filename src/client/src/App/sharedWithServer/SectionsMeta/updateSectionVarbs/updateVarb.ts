import { valueMetas } from "../baseSectionsDerived/valueMetas";
import { ValueByValueName } from "../baseSectionsDerived/valueMetaTypes";
import {
  LeftRightPropCalcName,
  NumPropCalcName,
} from "../baseSectionsVarbs/baseValues/calculations";
import { decimalRounding } from "../baseSectionsVarbs/baseValues/calculations/numUnitParams";
import { StateValue } from "../baseSectionsVarbs/baseValues/StateValueTypes";
import { ValueUnit } from "../baseSectionsVarbs/baseVarbs";
import { ValueName } from "../baseSectionsVarbs/ValueName";
import { ChildName } from "../sectionChildrenDerived/ChildName";
import { SectionName } from "../SectionName";
import { getUpdateFnNames } from "./updateVarb/UpdateFnName";
import { UpdateFnProp, updateFnPropS } from "./updateVarb/UpdateFnProps";
import { UpdateProps, updatePropsS } from "./updateVarb/UpdateProps";

export interface GeneralUpdateVarb extends UpdateProps {
  valueName: ValueName;
  initValue: StateValue;
  calculateRound: number;
}

export interface UpdateVarb<VN extends ValueName>
  extends GeneralUpdateVarb,
    UpdateProps {
  valueName: VN;
  initValue: ValueByValueName<VN>;
  calculateRound: number;
}

export const calculatedRounding: Record<ValueUnit, number> = {
  dollars: 2,
  percent: 6,
  decimal: decimalRounding,
  max: 10,
} as const;

const checkUpdateVarb = <VN extends ValueName, T extends UpdateVarb<VN>>(
  _: VN,
  value: T
): T => value;

export function defaultUpdateVarb<VN extends ValueName>(
  valueName: VN
): UpdateVarb<VN> {
  const valueMeta = valueMetas[valueName];
  return checkUpdateVarb(valueName, {
    valueName,
    initValue: valueMeta.initDefault() as ValueByValueName<VN>,
    updateFnName: getUpdateFnNames(valueName)[0],
    updateFnProps: {},
    updateOverrides: [],
    calculateRound: 10,
  });
}

export function updateVarb<VN extends ValueName>(
  valueName: VN,
  partial: Partial<UpdateVarb<VN>> = {}
): UpdateVarb<VN> {
  return {
    ...defaultUpdateVarb(valueName),
    ...partial,
  };
}

export type UpdateVarbOptions<VN extends ValueName> = Partial<UpdateVarb<VN>>;

export type LeftRightVarbInfos = [UpdateFnProp, UpdateFnProp];
export const relVarbS = {
  get displayNameEditor() {
    return updateVarb("string", updatePropsS.simple("manualUpdateOnly"));
  },
  sumNums(
    nums: UpdateFnProp[],
    options?: UpdateVarbOptions<"numObj">
  ): UpdateVarb<"numObj"> {
    return updateVarb("numObj", {
      ...updatePropsS.sumNums(nums),
      ...options,
    });
  },
  sumChildNums<SN extends SectionName>(
    childName: ChildName<SN>,
    varbName: string
  ) {
    return this.sumNums([updateFnPropS.children(childName, varbName)]);
  },
  singlePropFn(
    updateFnName: NumPropCalcName,
    num: UpdateFnProp,
    options?: UpdateVarbOptions<"numObj">
  ): UpdateVarb<"numObj"> {
    return updateVarb("numObj", {
      ...updatePropsS.singlePropCalc(updateFnName, num),
      ...options,
    });
  },
  leftRightPropFn(
    updateFnName: LeftRightPropCalcName,
    leftRight: LeftRightVarbInfos,
    options?: UpdateVarbOptions<"numObj">
  ): UpdateVarb<"numObj"> {
    const [left, right] = leftRight;
    return updateVarb("numObj", {
      ...updatePropsS.leftRightPropCalc(updateFnName, left, right),
      ...options,
    });
  },
};