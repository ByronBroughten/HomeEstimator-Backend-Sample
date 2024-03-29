import { SxProps } from "@mui/material";
import { FeIdProp } from "../../../../../../../../sharedWithServer/SectionInfos/NanoIdInfo";
import { GetterSection } from "../../../../../../../../sharedWithServer/StateGetters/GetterSection";
import { VarbName } from "../../../../../../../../sharedWithServer/sectionVarbsConfigDerived/baseSectionsDerived/baseSectionsVarbsTypes";
import { useGetterSection } from "../../../../../../../stateClassHooks/useGetterSection";
import { nativeTheme } from "../../../../../../../theme/nativeTheme";
import { icons } from "../../../../../../Icons";
import { useInputModalWithContext } from "../../../../../../Modals/InputModalProvider";
import { SubSectionBtn } from "../../../../../../appWide/GeneralSection/GeneralSectionTitle/SubSectionBtn";
import { StyledActionBtn } from "../../../../../../appWide/GeneralSection/MainSection/StyledActionBtn";
import { LabeledVarbRow } from "../../../../../../appWide/LabeledVarbRow";
import { MuiRow } from "../../../../../../general/MuiRow";
import { UnitList } from "../Units/UnitList";
import { arrSx } from "./../../../../../../../utils/mui";

interface Props extends FeIdProp {
  showRent?: boolean;
  sx?: SxProps;
}

function useShowUnitInfo(property: GetterSection<"property">): boolean {
  const units = property.children("unit");
  const unitCount = units.length;
  if (unitCount > 1) {
    return true;
  }

  const firstUnit = units[0];
  const brText = firstUnit.valueNext("numBedrooms").mainText;
  const rentEditor = firstUnit.onlyChild("targetRentEditor");
  const rentText = rentEditor.valueNext("valueEditor").mainText;
  if (brText || rentText) {
    return true;
  } else {
    return false;
  }
}

export function UnitsNext({ feId, sx, showRent = true }: Props) {
  const property = useGetterSection({ sectionName: "property", feId });
  const { setModal } = useInputModalWithContext();
  const openUnits = () =>
    setModal({
      title: "Units",
      children: <UnitList {...{ feId, showRent }} />,
      showFinish: true,
    });

  const varbsToShow: VarbName<"property">[] = ["numUnits", "numBedrooms"];

  if (showRent) {
    varbsToShow.push("targetRentMonthly");
  }

  const showUnitInfo = useShowUnitInfo(property);
  return (
    <MuiRow
      sx={[
        {
          marginTop: nativeTheme.s2,
          marginBottom: nativeTheme.editorMargins,
        },
        ...arrSx(sx),
      ]}
    >
      {showUnitInfo && (
        <>
          <StyledActionBtn
            {...{
              onClick: openUnits,
              middle: "Edit Units",
              left: icons.edit(),
              sx: {
                fontSize: nativeTheme.inputLabel.fontSize,
                marginRight: nativeTheme.s35,
                border: `solid 1px ${nativeTheme["gray-300"]}`,
                height: "60px",
                borderRadius: nativeTheme.muiBr0,
              },
            }}
          />
          <LabeledVarbRow
            {...{ varbPropArr: property.varbInfoArr(...varbsToShow) }}
          />
        </>
      )}
      {!showUnitInfo && (
        <SubSectionBtn
          {...{
            onClick: openUnits,
            left: icons.addUnit({ size: 22 }),
            middle: "Add Units",
            sx: {
              fontSize: nativeTheme.inputLabel.fontSize,
              borderRadius: nativeTheme.muiBr0,
              lineHeight: "1.2rem",
              height: 60,
              width: 140,
            },
          }}
        />
      )}
    </MuiRow>
  );
}
