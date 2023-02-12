import { SectionPack } from "../../SectionsMeta/sectionChildrenDerived/SectionPack";
import { numObj } from "../../SectionsMeta/values/StateValue/NumObj";
import { numObjNext } from "../../SectionsMeta/values/StateValue/numObjNext";
import { stringObj } from "../../SectionsMeta/values/StateValue/StringObj";
import { PackBuilderSection } from "../../StatePackers.ts/PackBuilderSection";
import { Obj } from "../../utils/Obj";
import {
  priceSqftMiscRepairHybrid,
  userVarbLifespans,
} from "./makeExampleOngoingListsProps";

type UserVarbLifespansMap = typeof userVarbLifespans;
type UserVarbLifespanArrs = UserVarbLifespansMap[keyof UserVarbLifespansMap][];
const userVarbLifespanArrs: UserVarbLifespanArrs = Obj.keys(
  userVarbLifespans
).map((key) => {
  return userVarbLifespans[key];
});

const fullLists = [
  ["Average lifespan examples", userVarbLifespanArrs],
  [
    "Common repair examples",
    [
      ["Swap toilet hardware", numObj(30)],
      ["Change deadbolt", numObj(20)],
      ["Add smoke detector", numObj(15)],
      ["Install outlet", numObj(30)],
    ],
  ],
  [
    "Replacement cost examples",
    [
      ["Vinyl plank per sqft", numObj(3)],
      ["Force Air Furnace", numObj(3500)],
      ["Water heater", numObj(1200)],
      ["Window", numObj(500)],
      ["Stove", numObj(600)],
      ["Refrigerator", numObj(800)],
      ["Laundry", numObj(1200)],
      ["Roof", numObj(8000)],
    ],
  ],
  [
    "Misc Repair Estimate Methods",
    [
      ["10% of Rent", numObjNext(["targetRentMonthly"], "* .10")],
      ["1% of Price", numObjNext(["price"], "* .01")],
      ["Square Feet", numObjNext(["sqft"])],
      ["Price/Sqft Hybrid", priceSqftMiscRepairHybrid],
    ],
  ],
] as const;

const lists = [
  [
    "Custom repair cost examples",
    [
      ["Change deadbolt", numObj(20)],
      ["Smoke detector", numObj(15)],
      ["Install outlet", numObj(30)],
    ],
  ],
] as const;

export function makeExampleUserVarbLists(): SectionPack<"userVarbList">[] {
  const feUser = PackBuilderSection.initAsOmniChild("feUser");
  for (const listArr of lists) {
    const varbList = feUser.addAndGetChild("userVarbListMain", {
      dbVarbs: { displayName: stringObj(listArr[0]) },
    });
    for (const item of listArr[1]) {
      varbList.addChild("userVarbItem", {
        dbVarbs: {
          displayNameEditor: item[0],
          valueEditor: item[1],
        },
      });
    }
  }

  return feUser.makeChildPackArr("userVarbListMain");
}
