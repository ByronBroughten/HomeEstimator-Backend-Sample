import { View } from "react-native";
import { isDealMode } from "../../sharedWithServer/SectionsMeta/values/StateValue/dealMode";
import { dealModeLabels } from "../../sharedWithServer/SectionsMeta/values/StateValue/unionValues";
import { BackBtnWrapper } from "../appWide/BackBtnWrapper";
import { BackgroundContainer } from "../appWide/BackgroundContainter";
import { PageTitle } from "../appWide/PageTitle";
import { useGoToPage } from "../customHooks/useGoToPage";
import { BigStringEditor } from "../inputs/BigStringEditor";
import { nativeTheme } from "./../../theme/nativeTheme";
import { Row } from "./../general/Row";
import { OutputSection } from "./ActiveDeal/DealOutputs/OutputSection";
import { DealSubSectionClosed } from "./ActiveDeal/DealSubSectionClosed";
import { FinishBtn } from "./ActiveDeal/FinishBtn";
import { useActiveDealPage } from "./ActiveDeal/useActiveDealSection";

const dealElementProps = {
  sx: {
    marginTop: nativeTheme.s5,
  },
};

export function ActiveDealMain() {
  const goToAccountPage = useGoToPage("account");
  const { deal, feStore } = useActiveDealPage();
  const dealMode = deal.valueNext("dealMode");
  const completionStatus = deal.valueNext("completionStatus");
  return (
    <BackBtnWrapper {...{ to: "account", label: "Deal Menu" }}>
      <BackgroundContainer>
        <PageTitle
          sx={{ marginTop: nativeTheme.s35 }}
          text={`${dealModeLabels[dealMode]}`}
        />
        <Row
          style={{
            alignItems: "flex-end",
            marginTop: nativeTheme.s35,
          }}
        >
          <BigStringEditor
            {...{
              label: "Title",
              feVarbInfo: deal.varbNext("displayNameEditor").feVarbInfo,
            }}
          />
        </Row>
        <View>
          <DealSubSectionClosed {...dealElementProps} childName="property" />
          <DealSubSectionClosed
            {...dealElementProps}
            childName="purchaseFinancing"
          />
          {isDealMode(dealMode, "hasRefi") && (
            <DealSubSectionClosed
              {...dealElementProps}
              childName="refiFinancing"
            />
          )}
          {isDealMode(dealMode, "hasMgmt") && (
            <DealSubSectionClosed
              {...dealElementProps}
              childName="mgmtOngoing"
            />
          )}
        </View>
        <OutputSection
          {...{
            ...dealElementProps,
            dealIsComplete: completionStatus === "allValid",
            feId: feStore.onlyChildFeId("outputSection"),
            disableOpenOutputs: completionStatus !== "allValid",
            dealMode,
          }}
        />
        <FinishBtn
          {...{
            sx: {
              ...dealElementProps.sx,
              marginBottom: dealElementProps.sx.marginTop,
            },
            btnText: "Finish",
            onClick: goToAccountPage,
          }}
        />
      </BackgroundContainer>
    </BackBtnWrapper>
  );
}
