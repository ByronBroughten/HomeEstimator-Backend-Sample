import { View } from "react-native";
import { BackBtnWrapper } from "../appWide/BackBtnWrapper";
import { BackgroundContainer } from "../appWide/BackgroundContainter";
import { MuiSelect } from "../appWide/MuiSelect";
import { BigStringEditor } from "../inputs/BigStringEditor";
import { validateStateValue } from "./../../sharedWithServer/SectionsMeta/values/valueMetas";
import { useAction } from "./../../sharedWithServer/stateClassHooks/useAction";
import { nativeTheme } from "./../../theme/nativeTheme";
import { SectionTitle } from "./../appWide/SectionTitle";
import { Row } from "./../general/Row";
import { OutputSection } from "./ActiveDeal/DealOutputs/OutputSection";
import { DealSubSectionClosed } from "./ActiveDeal/DealSubSectionClosed";
import { useActiveDealPage } from "./ActiveDeal/useActiveDealSection";

const dealElementProps = {
  sx: {
    marginTop: nativeTheme.s5,
  },
};

export function ActiveDealMain() {
  const { deal, calcVarbs, feStore } = useActiveDealPage();
  const dealMode = deal.valueNext("dealMode");
  const completionStatus = calcVarbs.value("dealCompletionStatus");
  const changeDealMode = useAction("changeActiveDealMode");
  return (
    <BackBtnWrapper {...{ to: "account", label: "Deal Menu" }}>
      <BackgroundContainer>
        <SectionTitle
          sx={{ fontSize: nativeTheme.fs24, marginTop: nativeTheme.s35 }}
          text="Deal"
        />
        <Row
          style={{
            alignItems: "flex-end",
            marginTop: nativeTheme.s35,
          }}
        >
          <MuiSelect
            {...{
              onChangeOverride: (e) => {
                changeDealMode({
                  dealMode: validateStateValue(e.target.value, "dealMode"),
                });
              },
              feVarbInfo: {
                sectionName: "deal",
                feId: deal.feId,
                varbName: "dealMode",
              },
              unionValueName: "dealMode",
              items: [
                ["buyAndHold", "Buy & Hold"],
                ["fixAndFlip", "Fix & Flip"],
              ],
              label: "Type",
            }}
          />
          <BigStringEditor
            {...{
              label: "Title",
              // placeholder: "Title",
              feVarbInfo: deal.varbNext("displayNameEditor").feVarbInfo,
              sx: { ml: nativeTheme.s35 },
            }}
          />
        </Row>
        <View>
          <DealSubSectionClosed {...dealElementProps} sectionName="property" />
          <DealSubSectionClosed {...dealElementProps} sectionName="financing" />
          {dealMode !== "fixAndFlip" && (
            <DealSubSectionClosed {...dealElementProps} sectionName="mgmt" />
          )}
        </View>
        <OutputSection
          {...{
            ...dealElementProps,
            feId: feStore.onlyChildFeId("outputSection"),
            disableOpenOutputs: completionStatus !== "allValid",
            dealMode,
          }}
        />
      </BackgroundContainer>
    </BackBtnWrapper>
  );
}
