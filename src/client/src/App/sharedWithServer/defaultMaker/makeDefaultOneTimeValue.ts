import { PackBuilderSection } from "../StatePackers/PackBuilderSection";

export function makeDefaultOneTimeValue() {
  const singleTimeValue = PackBuilderSection.initAsOmniChild("singleTimeValue");
  singleTimeValue.updateValues({ valueSourceName: "none" });
  const list = singleTimeValue.addAndGetChild("singleTimeList");
  list.updateValues({ itemValueSource: "valueEditor" });
  return singleTimeValue.makeSectionPack();
}
