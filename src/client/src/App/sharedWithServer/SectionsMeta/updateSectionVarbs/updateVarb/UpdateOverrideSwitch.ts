import {
  getSwitchVarbName,
  SwitchName,
  SwitchTargetKey,
} from "../../allBaseSectionVarbs/baseSwitchNames";
import {
  validateAnyVarbName,
  VarbNameWide,
} from "../../baseSectionsDerived/baseSectionsVarbsTypes";
import { ChildName } from "../../sectionChildrenDerived/ChildName";
import { mixedInfoS } from "../../SectionInfo/MixedSectionInfo";
import { PathNameVarbInfoMixed } from "../../SectionInfo/PathNameInfo";
import {
  RelChildrenVarbInfo,
  RelLocalVarbInfo,
  relVarbInfoS,
} from "../../SectionInfo/RelVarbInfo";
import { isVarbName } from "../../SectionInfo/VarbInfoBase";
import {
  VarbPathName,
  VarbPathNameInfoMixed,
  VarbPathValue,
} from "../../SectionInfo/VarbPathNameInfo";
import {
  SectionPathName,
  SectionPathVarbName,
} from "../../sectionPathContexts/sectionPathNames";
import { ValueSource } from "../../values/StateValue/unionValues";

export type UpdateOverrideSwitches = readonly UpdateOverrideSwitch[];

export interface UpdateOverrideSwitch {
  switchInfo: UpdateOverrideSwitchInfo;
  switchValues: OverrideSwitchValue[];
}

type OverrideSwitchValue = string | boolean;

export type UpdateOverrideSwitchInfo =
  | RelChildrenVarbInfo
  | RelLocalVarbInfo
  | VarbPathNameInfoMixed
  | PathNameVarbInfoMixed;

export function overrideSwitch(
  switchInfo: RelLocalVarbInfo | VarbPathNameInfoMixed | PathNameVarbInfoMixed,
  ...switchValues: OverrideSwitchValue[]
): UpdateOverrideSwitch {
  return {
    switchInfo,
    switchValues,
  };
}

export type StandardSP = UpdateOverrideSwitchInfo | VarbNameWide;
export function standardToOsInfo(
  standard: StandardSP
): UpdateOverrideSwitchInfo {
  return isVarbName(standard) ? relVarbInfoS.local(standard) : standard;
}

export const overrideSwitchS = {
  switchIsActive<SN extends SwitchName, SK extends SwitchTargetKey<SN>>(
    baseName: string,
    switchName: SN,
    ...switchValues: SK[]
  ): UpdateOverrideSwitch {
    const varbName = getSwitchVarbName(baseName, switchName, "switch");
    return this.local(
      validateAnyVarbName(varbName),
      ...(switchValues as string[])
    );
  },
  general(
    switchInfo: StandardSP,
    ...switchValues: OverrideSwitchValue[]
  ): UpdateOverrideSwitch {
    return {
      switchInfo: standardToOsInfo(switchInfo),
      switchValues,
    };
  },
  local(
    varbName: VarbNameWide,
    ...switchValues: OverrideSwitchValue[]
  ): UpdateOverrideSwitch {
    return this.general(varbName, ...switchValues);
  },
  child(
    childName: ChildName,
    varbName: string,
    ...switchValues: OverrideSwitchValue[]
  ): UpdateOverrideSwitch {
    return {
      switchInfo: relVarbInfoS.children(childName, varbName),
      switchValues,
    };
  },
  periodic<K extends SwitchTargetKey<"periodic">>(
    baseName: string,
    switchKey: K
  ): UpdateOverrideSwitch {
    const varbName = getSwitchVarbName(baseName, "periodic", "switch");
    return this.local(validateAnyVarbName(varbName), switchKey);
  },
  monthsIsActive(baseName: string) {
    return this.switchIsActive(baseName, "monthsYears", "months");
  },
  yearsIsActive(baseName: string) {
    return this.switchIsActive(baseName, "monthsYears", "years");
  },
  monthlyIsActive(baseVarbName: string): UpdateOverrideSwitch {
    return this.periodic(baseVarbName, "monthly");
  },
  yearlyIsActive(baseVarbName: string): UpdateOverrideSwitch {
    return this.periodic(baseVarbName, "yearly");
  },
  pathHasValue<PN extends SectionPathName, VN extends SectionPathVarbName<PN>>(
    pathName: PN,
    varbName: VN,
    ...switchValues: OverrideSwitchValue[]
  ): UpdateOverrideSwitch {
    return {
      switchInfo: mixedInfoS.pathNameVarb(pathName, varbName),
      switchValues,
    };
  },
  varbIsValue<VPN extends VarbPathName>(
    varbPathName: VPN,
    ...switchValues: Extract<VarbPathValue<VPN>, OverrideSwitchValue>[]
  ): UpdateOverrideSwitch {
    return {
      switchInfo: mixedInfoS.varbPathName(varbPathName),
      switchValues,
    };
  },
  isTrue(prop: StandardSP): UpdateOverrideSwitch {
    return this.general(prop, true);
  },
  isFalse(prop: StandardSP): UpdateOverrideSwitch {
    return this.general(prop, false);
  },
  valueSourceIs(
    valueSource: ValueSource,
    prop?: StandardSP
  ): UpdateOverrideSwitch {
    return this.general(prop ?? "valueSourceName", valueSource);
  },

  childValueSourceIs(childName: ChildName, ...valueSource: ValueSource[]) {
    return this.child(childName, "valueSourceName", ...valueSource);
  },
};

export const osS = overrideSwitchS;
