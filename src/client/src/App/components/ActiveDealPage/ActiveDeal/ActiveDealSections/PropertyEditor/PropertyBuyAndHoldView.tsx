import { dealModeLabels } from "../../../../../sharedWithServer/SectionsMeta/values/StateValue/unionValues";
import { BasicBuyAndHoldInfo } from "./ViewChunks/BasicBuyAndHoldInfo";
import { PropertyEditorBody } from "./ViewChunks/PropertyEditorBody";
import { PropertyOngoingCosts } from "./ViewChunks/PropertyOngoingCosts";
import { RehabSection } from "./ViewChunks/PropertyRehab";

export function PropertyBuyAndHoldView({ feId }: { feId: string }) {
  return (
    <PropertyEditorBody
      {...{
        feId,
        sectionTitle: "Property",
        titleAppend: dealModeLabels.buyAndHold,
      }}
    >
      <BasicBuyAndHoldInfo feId={feId} />
      <PropertyOngoingCosts feId={feId} />
      <RehabSection {...{ feId, dealMode: "buyAndHold" }} />
    </PropertyEditorBody>
  );
}
