import { PackBuilderSection } from "../StateClasses/Packers/PackBuilderSection";
import { GetterSection } from "../StateGetters/GetterSection";
import { DealMode } from "../sectionVarbsConfig/StateValue/dealMode";
import { VarbName } from "../sectionVarbsConfigDerived/baseSectionsDerived/baseSectionsVarbsTypes";

const outputPerDeal: Record<DealMode, VarbName<"deal">> = {
  homeBuyer: "expensesOngoingMonthly",
  buyAndHold: "cocRoiYearly",
  fixAndFlip: "valueAddRoiPercent",
  brrrr: "valueAddRoiPercent",
};

export function makeDefaultSessionDeal(deal: GetterSection<"deal">) {
  const dealMode = deal.valueNext("dealMode");
  const sessionDeal = PackBuilderSection.initAsOmniChild("sessionDeal", {
    dbId: deal.dbId,
  });
  sessionDeal.updateValues({
    dateTimeCreated: deal.valueNext("dateTimeFirstSaved"),
    displayName: deal.valueNext("displayName").mainText,
    dealMode,
  });

  const varbName = outputPerDeal[dealMode];
  const varb = deal.varbNext(varbName);
  const displayVarb = varb.displayVarb();
  const { displayName } = varb;

  sessionDeal.addChild("sessionVarb", {
    sectionValues: { varbName, label: displayName, value: displayVarb },
  });

  return sessionDeal.makeSectionPack();
}
