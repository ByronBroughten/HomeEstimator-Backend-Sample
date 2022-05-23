import { SectionPackBuilder } from "../../../../../../SectionFocal/SectionPackBuilder";
import { SectionPackRaw } from "../../../../../SectionPackRaw";

export function makeDefaultOutputList(): SectionPackRaw<"dealOutputList"> {
  const main = new SectionPackBuilder();
  const outputList = main.addAndGetDescendant(["analysis", "dealOutputList"]);
  outputList.addChild("output", {
    dbVarbs: {
      id: "static",
      idType: "relative",
      sectionName: "final",
      varbName: "totalInvestment",
    },
  });
  outputList.addChild("output", {
    dbVarbs: {
      id: "static",
      idType: "relative",
      sectionName: "final",
      varbName: "cashFlowYearly",
    },
  });
  outputList.addChild("output", {
    dbVarbs: {
      id: "static",
      idType: "relative",
      sectionName: "final",
      varbName: "roiYearly",
    },
  });
  return outputList.makeSectionPack();
}
