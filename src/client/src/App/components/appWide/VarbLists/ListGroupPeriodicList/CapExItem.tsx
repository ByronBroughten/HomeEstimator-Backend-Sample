import { Box } from "@mui/material";
import React from "react";
import { useGetterSection } from "../../../../sharedWithServer/stateClassHooks/useGetterSection";
import { NumObjEntityEditor } from "../../../inputs/NumObjEntityEditor";
import { PeriodicEditor } from "../../../inputs/PeriodicEditor";
import { NameEditorCell } from "../../ListGroup/ListGroupShared/NameEditorCell";
import { FirstContentCell } from "../../ListGroup/ListGroupShared/VarbListGeneric/FirstContentCellAndHeader";
import { VarbListItemStyled } from "../../ListGroup/ListGroupShared/VarbListItemStyled";
import { XBtnCell } from "../../ListGroup/ListGroupShared/XBtnCell";

interface MemoProps extends Props {
  displayValueVarb: string;
  displayName?: string;
}
const ListItemOngoingMemo = React.memo(function ListItemOngoingMemo({
  displayValueVarb,
  displayName,
  feId,
}: MemoProps) {
  const feInfo = { sectionName: "capExItem", feId } as const;
  const capExItem = useGetterSection(feInfo);
  const lifespanEditor = capExItem.onlyChild("lifespanEditor");
  const lifespan = lifespanEditor.valueNext("valueEditor").mainText;
  const costToReplace = capExItem.valueNext("costToReplace").mainText;
  return (
    <VarbListItemStyled
      {...{
        className: "CapExItem-root",
        sx: {
          "& .CapExItem-costToReplace": {
            "& .DraftEditor-root": {
              minWidth: "93px",
            },
          },
        },
      }}
    >
      <NameEditorCell {...{ displayName, ...feInfo }} />
      <FirstContentCell>
        <NumObjEntityEditor
          className="CapExItem-costToReplace"
          labelProps={{ showLabel: false }}
          feVarbInfo={{
            ...feInfo,
            varbName: "costToReplace",
          }}
          editorType="equation"
          quickViewVarbNames={["numUnits", "numBedrooms", "sqft"]}
        />
      </FirstContentCell>
      <td>
        <PeriodicEditor
          feId={capExItem.onlyChildFeId("lifespanEditor")}
          labelInfo={null}
          labelProps={{ showLabel: false }}
          editorType="equation"
          sx={{
            "& .DraftEditor-root": {
              minWidth: "28px",
            },
          }}
        />
      </td>
      <td>=</td>
      <td>
        <Box component={"span"} sx={{ fontSize: "17px" }}>
          {`${lifespan && costToReplace ? displayValueVarb : "?"}`}
        </Box>
      </td>
      <XBtnCell {...feInfo} />
    </VarbListItemStyled>
  );
});

type Props = { feId: string };
export function CapExItem({ feId }: Props) {
  const section = useGetterSection({ sectionName: "capExItem", feId });
  const valueVarbName = "valueDollarsMonthly";
  const valueVarb = section.varbNext(valueVarbName);
  return (
    <ListItemOngoingMemo
      {...{
        ...section.feInfo,
        displayValueVarb: valueVarb.displayVarb(),
      }}
    />
  );
}
