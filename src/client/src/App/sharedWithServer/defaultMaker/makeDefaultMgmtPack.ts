import { SectionPack } from "../SectionsMeta/sectionChildrenDerived/SectionPack";
import { PackBuilderSection } from "../StatePackers.ts/PackBuilderSection";

export function makeDefaultMgmtPack(): SectionPack<"mgmt"> {
  const mgmt = PackBuilderSection.initAsOmniChild("mgmt", {
    sectionValues: {
      basePayUnitSwitch: "percent",
      basePayDollarsOngoingSwitch: "monthly",
      vacancyLossDollarsOngoingSwitch: "monthly",
      expensesOngoingSwitch: "monthly",
    },
  });
  mgmt.addChild("upfrontExpenseGroup");
  mgmt.addChild("ongoingExpenseGroup");
  return mgmt.makeSectionPack();
}
