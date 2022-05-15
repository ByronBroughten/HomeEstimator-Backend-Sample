import { EditorState } from "draft-js";
import { Dispatch, SetStateAction } from "react";
import { FeVarbInfo } from "../../sharedWithServer/SectionsMeta/relSections/rel/relVarbInfoTypes";
import { isEditorChanged } from "../../utils/DraftS";

interface UseOnChangeProps {
  feVarbInfo: FeVarbInfo;
  editorState: EditorState;
  setEditorState: Dispatch<SetStateAction<EditorState>>;
}
export default function useOnChange({
  editorState,
  setEditorState,
}: UseOnChangeProps) {
  return function onChange(newEditorState: EditorState) {
    const editorIsChanged = isEditorChanged(editorState, newEditorState);
    const selection = editorState.getSelection();
    if (!selection.getHasFocus() && !editorIsChanged) {
      newEditorState = EditorState.moveFocusToEnd(newEditorState);
    }
    setEditorState(() => {
      return newEditorState;
    });
  };
}
