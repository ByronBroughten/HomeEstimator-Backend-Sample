import { SectionPack } from "../../SectionsMeta/sectionChildrenDerived/SectionPack";
import {
  numObj,
  NumObj,
  numToObj,
} from "../../SectionsMeta/values/StateValue/NumObj";
import { stringObj } from "../../SectionsMeta/values/StateValue/StringObj";
import { PackBuilderSection } from "../../StatePackers/PackBuilderSection";

type UtilityItemProp = readonly [string, NumObj];
export function makeUtilityList(
  itemPropArr: readonly UtilityItemProp[],
  dbId?: string
) {
  const feStore = PackBuilderSection.initAsOmniChild("feStore");

  const valueSource = "valueEditor";
  const utilityList = feStore.addAndGetChild("ongoingListMain", {
    dbId,
    sectionValues: {
      itemValueSource: valueSource,
      itemOngoingSwitch: "monthly",
      totalOngoingSwitch: "monthly",
      displayName: stringObj("Utility Examples"),
    },
  });
  for (const itemProps of itemPropArr) {
    utilityList.addChild("ongoingItem", {
      sectionValues: {
        displayNameEditor: itemProps[0],
        valueOngoingSwitch: "monthly",
        valueSourceName: valueSource,
        valueOngoingEditor: itemProps[1],
      },
    });
  }
  return utilityList.makeSectionPack();
}

type SingleTimeItemProp = readonly [string, number | NumObj];
export function makeExampleSingleTimeList(
  listTitle: string,
  itemPropArr: readonly SingleTimeItemProp[],
  dbId?: string
): SectionPack<"singleTimeList"> {
  const list = PackBuilderSection.initAsOmniChild("singleTimeList");
  list.updateValues({ displayName: stringObj(listTitle) });
  dbId && list.updater.updateDbId(dbId);

  for (const itemProps of itemPropArr) {
    const value = itemProps[1];
    list.addChild("singleTimeItem", {
      sectionValues: {
        displayNameEditor: itemProps[0],
        valueEditor: typeof value === "number" ? numObj(value) : value,
      },
    });
  }
  return list.makeSectionPack();
}

// displayName, lifespan, replacementCost... last two should swap
type CapExItemProp = readonly [string, number | NumObj, number | NumObj];
export function makeCapExList(
  itemPropArr: readonly CapExItemProp[],
  dbId?: string
): SectionPack<"capExList"> {
  const feStore = PackBuilderSection.initAsOmniChild("feStore");
  const itemOngoingSwitch = "yearly";
  const capExList = feStore.addAndGetChild("capExListMain", {
    dbId,
    sectionValues: {
      itemOngoingSwitch,
      totalOngoingSwitch: "yearly",
    },
  });
  for (const itemProps of itemPropArr) {
    capExList.addChild("capExItem", {
      sectionValues: {
        displayNameEditor: itemProps[0],
        valueOngoingSwitch: itemOngoingSwitch,
        lifespanSpanEditor: numToObj(itemProps[1]),
        lifespanSpanSwitch: "years",
        costToReplace: numToObj(itemProps[2]),
      },
    });
  }
  return capExList.makeSectionPack();
}
