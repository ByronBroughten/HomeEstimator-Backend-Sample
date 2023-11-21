import { SectionPack } from "../../SectionsMeta/sectionChildrenDerived/SectionPack";
import {
  numObj,
  NumObj,
  numToObj,
} from "../../SectionsMeta/values/StateValue/NumObj";
import { numObjNext } from "../../SectionsMeta/values/StateValue/numObjNext";
import { stringObj } from "../../SectionsMeta/values/StateValue/StringObj";
import { PackBuilderSection } from "../../StatePackers/PackBuilderSection";

export function makeNationalUtilityAverageList() {
  return makeExampleUtilityList("National utility averages", [
    ["Natural gas", numObjNext(["sqft"], "*0.019855")],
    ["Electricity", numObjNext("95.47+(", ["sqft"], "*0.0226446)")],
    ["Water/sewer", numObj(37.38)],
    ["Garbage", numObj(37.37)],
  ]);
}

type UtilityItemProp = [string, number | NumObj];
export function makeExampleUtilityList(
  displayName: string,
  itemPropArr: UtilityItemProp[]
) {
  const feStore = PackBuilderSection.initAsOmniChild("feStore");

  const valueSource = "valueDollarsPeriodicEditor";
  const utilityList = feStore.addAndGetChild("ongoingListMain", {
    sectionValues: {
      itemValueSource: valueSource,
      itemPeriodicSwitch: "monthly",
      displayName: stringObj(displayName),
    },
  });
  for (const itemProps of itemPropArr) {
    utilityList.addChild("periodicItem", {
      sectionValues: {
        displayNameEditor: itemProps[0],
        valueDollarsPeriodicSwitch: "monthly",
        valueSourceName: valueSource,
        valueDollarsPeriodicEditor: numToObj(itemProps[1]),
      },
    });
  }
  return utilityList.makeSectionPack();
}

type OneTimeItemProp = readonly [string, number | NumObj];
export function makeExampleOneTimeList(
  listTitle: string,
  itemPropArr: readonly OneTimeItemProp[],
  dbId?: string
): SectionPack<"onetimeList"> {
  const list = PackBuilderSection.initAsOmniChild("onetimeList");
  list.updateValues({ displayName: stringObj(listTitle) });
  dbId && list.updater.updateDbId(dbId);

  for (const itemProps of itemPropArr) {
    const value = itemProps[1];
    list.addChild("onetimeItem", {
      sectionValues: {
        displayNameEditor: itemProps[0],
        valueDollarsEditor: typeof value === "number" ? numObj(value) : value,
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
  const itemPeriodicSwitch = "yearly";
  const capExList = feStore.addAndGetChild("capExListMain", {
    dbId,
    sectionValues: { itemPeriodicSwitch },
  });
  for (const itemProps of itemPropArr) {
    capExList.addChild("capExItem", {
      sectionValues: {
        displayNameEditor: itemProps[0],
        lifespanSpanEditor: numToObj(itemProps[1]),
        lifespanSpanSwitch: "years",
        costToReplace: numToObj(itemProps[2]),
      },
    });
  }
  return capExList.makeSectionPack();
}
