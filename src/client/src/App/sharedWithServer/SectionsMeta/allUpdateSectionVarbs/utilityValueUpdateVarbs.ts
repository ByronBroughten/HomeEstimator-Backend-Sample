import { GroupKey, groupNameEnding, GroupRecord } from "../GroupName";
import { VarbPathName } from "../SectionInfo/VarbPathNameInfo";
import { usvs, USVS } from "../updateSectionVarbs/updateSectionVarbs";
import { uvS } from "../updateSectionVarbs/updateVarb";
import { uosbS } from "../updateSectionVarbs/updateVarb/OverrideBasics";
import { ubS } from "../updateSectionVarbs/updateVarb/UpdateBasics";
import { uvsS } from "../updateSectionVarbs/updateVarbs";

export function utilityValueUpdateVarbs(): USVS<"utilityValue"> {
  return usvs("utilityValue", {
    valueSourceName: uvS.input("utilityValueSource", { initValue: "none" }),
    ...uvsS.periodic2("valueDollars", {
      monthly: valueDollars("monthly"),
      yearly: valueDollars("yearly"),
    }),
  });
}

function valueDollars(groupKey: GroupKey<"periodic">) {
  const ending = groupNameEnding("periodic", groupKey);
  const threeHundredFn: GroupRecord<"periodic", VarbPathName> = {
    monthly: "threeHundredPerUnit",
    yearly: "threeHundredPerUnitTimesTwelve",
  };
  return uosbS.valueSource("utilityValueSource", {
    none: ubS.emptyNumObj,
    zero: ubS.emptyNumObj,
    sameAsHoldingPhase: ubS.loadByVarbPathName(`utilitiesHolding${ending}`),
    threeHundredPerUnit: ubS.loadByVarbPathName(threeHundredFn[groupKey]),
    valueDollarsEditor: ubS.loadChild("valueDollarsEditor", `value${ending}`),
    listTotal: ubS.loadChild("periodicList", `total${ending}`),
  });
}