import { periodicName } from "../../../../../../../sharedWithServer/sectionVarbsConfig/GroupName";
import { useGetterSection } from "../../../../../../stateClassHooks/useGetterSection";
import { nativeTheme } from "../../../../../../theme/nativeTheme";
import { ToggledNode } from "../../../../../appWide/ToggledNode";
import { MuiRow } from "../../../../../general/MuiRow";
import { MortgageInsPeriodicValue } from "./MortgageInsPeriodicValue";
import { MortgageInsUpfrontValue } from "./MortgageInsUpfrontValue";

interface Props {
  feId: string;
  editorMargins?: boolean;
}
export function MortgageIns({ feId, editorMargins }: Props) {
  const loan = useGetterSection({ sectionName: "loan", feId });
  const mortIns = loan.onlyChild("mortgageInsPeriodicValue");
  const percentFreq = mortIns
    .onlyChild("valuePercentEditor")
    .valueNext("valueEditorFrequency");
  const displayVarbName = periodicName("mortgageIns", percentFreq);
  return (
    <ToggledNode
      {...{
        editorMargins,
        feVarbInfo: loan.varbInfo("hasMortgageIns"),
        toggledNode: (
          <MuiRow
            sx={{
              "& .MuiInputBase-root": {
                minWidth: "135px",
              },
            }}
          >
            <MortgageInsUpfrontValue
              {...{
                sx: { marginRight: nativeTheme.s3 },
                feId: loan.oneChildFeId("mortgageInsUpfrontValue"),
                totalDisplayVarb: loan.displayVarb("mortgageInsUpfront"),
              }}
            />
            <MortgageInsPeriodicValue
              {...{
                feId: loan.oneChildFeId("mortgageInsPeriodicValue"),
                dollarsDisplay: loan.displayVarb(displayVarbName),
              }}
            />
          </MuiRow>
        ),
      }}
    />
  );
}
