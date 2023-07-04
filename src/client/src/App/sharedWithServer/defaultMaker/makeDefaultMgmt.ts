import { SectionPack } from "../SectionsMeta/sectionChildrenDerived/SectionPack";
import { PackBuilderSection } from "../StatePackers/PackBuilderSection";

export function makeDefaultMgmt(): SectionPack<"mgmt"> {
  const mgmt = PackBuilderSection.initAsOmniChild("mgmt", {
    sectionValues: {
      basePayDollarsPeriodicSwitch: "monthly",
      vacancyLossDollarsPeriodicSwitch: "monthly",
      expensesPeriodicSwitch: "monthly",
    },
  });
  mgmt.addChild("mgmtBasePayValue");
  mgmt.addChild("vacancyLossValue");
  const ongoingCost = mgmt.addAndGetChild("miscOngoingCost");
  ongoingCost.addChild("periodicList");
  const oneTimeCost = mgmt.addAndGetChild("miscOnetimeCost");
  oneTimeCost.addChild("onetimeList");
  return mgmt.makeSectionPack();
}
