import { SxProps } from "@mui/material";
import { EditorState } from "draft-js";
import React from "react";
import { FeVarbInfo } from "../../../sharedWithServer/SectionInfos/FeInfo";
import { DealMode } from "../../../sharedWithServer/sectionVarbsConfig/StateValue/dealMode";
import { timeS } from "../../../sharedWithServer/utils/timeS";
import { useGetterSectionOnlyOne } from "../../stateClassHooks/useGetterSection";
import { nativeTheme } from "../../theme/nativeTheme";
import { StyledActionBtn } from "../appWide/GeneralSection/MainSection/StyledActionBtn";
import { useGoToPage } from "../customHooks/useGoToPage";
import { MuiRow } from "../general/MuiRow";
import { icons } from "../Icons";
import { MaterialStringEditor } from "../inputs/MaterialStringEditor";
import { OnVarbSelect } from "../inputs/NumObjEditor/NumObjVarbSelector/VarbSelectorCollection";
import { VarbSelectorByDealMode } from "../inputs/NumObjEditor/VarbSelectorByDealMode";
import { useDraftInput } from "../inputs/useDraftInput";
import { varSpanDecorator } from "./../inputs/shared/EntitySpanWithError";
import { ModalSection } from "./ModalSection";
import {
  useVarbSelectModal,
  VarbSelectModalOptions,
  VarbSelectModalState,
} from "./VarbSelectModalProvider";

export interface VarbSelectModalProps {
  modalIsOpen: boolean;
  closeModal: () => void;
  dealMode: DealMode<"plusMixed">;
  onVarbSelect: OnVarbSelect;
}

function useVarbSelectModalOptions(
  modalState: VarbSelectModalState
): VarbSelectModalOptions & { editorVarbInfo: FeVarbInfo } {
  const menu = useGetterSectionOnlyOne("variablesMenu");
  return {
    onVarbSelect: () => {},
    dealMode: "mixed",
    viewWindow: () => null,
    timeSet: 0,
    editorVarbInfo: menu.varbInfo("defaultViewEditor"),
    ...modalState,
  };
}

interface Props {
  modalWrapperProps?: { sx?: SxProps };
  modalChildren?: React.ReactNode;
}
export function VarbSelectorModal({ modalChildren, ...rest }: Props) {
  const goToVariables = useGoToPage("userVariables");
  const menu = useGetterSectionOnlyOne("variablesMenu");

  const { modalState, setModal } = useVarbSelectModal();

  const { timeSet, onVarbSelect, dealMode, viewWindow, editorVarbInfo } =
    useVarbSelectModalOptions(modalState);

  const { editorState, setEditorState } = useDraftInput({
    ...editorVarbInfo,
    compositeDecorator: varSpanDecorator,
  });

  React.useEffect(() => {
    if (modalState?.editorState) {
      const content = modalState.editorState.getCurrentContent();
      const selection = modalState.editorState.getSelection();
      const anchorOffset = selection.getAnchorOffset();
      const focusOffset = selection.getFocusOffset();

      let nextEditorState = EditorState.push(
        editorState,
        content,
        "insert-characters"
      );
      const nextSelection = nextEditorState.getSelection().merge({
        focusOffset,
        anchorOffset,
      });

      setEditorState(
        EditorState.acceptSelection(nextEditorState, nextSelection)
      );
    }
  }, [modalState?.editorState]);
  return (
    <ModalSection
      {...{
        ...rest,
        topChild: viewWindow({ editorState, setEditorState }),
        title: "Variable Select",
        titleSx: { color: nativeTheme.complementary.main, lineHeight: 1 },
        show: Boolean(modalState),
        closeModal: () => {
          if (timeSet && timeSet < timeS.now() - 200) {
            setModal(null);
          }
        },
      }}
    >
      {/* {viewWindow()} */}
      <MuiRow sx={{ justifyContent: "space-between" }}>
        <MaterialStringEditor
          {...{
            ...menu.varbInfo("nameFilter"),
            placeholder: "Filter",
            sx: {
              "& .DraftEditor-root": {
                minWidth: 120,
              },
            },
          }}
        />
        <StyledActionBtn
          sx={{
            border: `solid 1px ${nativeTheme["gray-300"]}`,
            ml: nativeTheme.s35,
            color: nativeTheme.darkBlue.dark,
            "&:hover": {
              color: nativeTheme.light,
              backgroundColor: nativeTheme.darkBlue.dark,
            },
          }}
          left={icons.variable({ size: 21 })}
          middle={"Your Variables"}
          onClick={goToVariables}
        />
      </MuiRow>
      <VarbSelectorByDealMode
        {...{
          sx: { mt: nativeTheme.s25 },
          dealMode,
          nameFilter: menu.valueNext("nameFilter"),
          onVarbSelect: (props) =>
            onVarbSelect({ ...props, editorState, setEditorState }),
        }}
      />
      {modalChildren}
    </ModalSection>
  );
}
