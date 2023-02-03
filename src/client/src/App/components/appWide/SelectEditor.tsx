import { FormControl, MenuItem, Select } from "@material-ui/core";
import React from "react";
import styled from "styled-components";
import { FeVarbInfo } from "../../sharedWithServer/SectionsMeta/SectionInfo/FeInfo";
import theme from "../../theme/Theme";
import { NumObjEntityEditor } from "../inputs/NumObjEntityEditor";

type OnChange = (
  event: React.ChangeEvent<{ name?: string | undefined; value: unknown }>
) => void;

export type SelectEditorProps = {
  className?: string;
  selectValue: string;
  onChange?: OnChange;
  editorVarbInfo?: FeVarbInfo;
  menuItems: [string, string][];
  equalsValue?: string;
  rightOfControls?: React.ReactNode;
};
export function SelectEditor({
  className,
  selectValue,
  onChange,
  editorVarbInfo,
  menuItems,
  equalsValue,
  rightOfControls,
}: SelectEditorProps) {
  return (
    <Styled className={`SelectEditor-controlDiv ${className ?? ""}`}>
      <FormControl
        className="SelectEditor-formControl"
        size="small"
        variant="filled"
        style={{ minWidth: "120px" }}
      >
        <Select
          className={`SelectEditor-select ${
            selectValue === "none" ? "SelectEditor-noneSelected" : ""
          }`}
          labelId="RepairsValue-modeLabel"
          id="demo-simple-select"
          autoWidth={true}
          value={selectValue}
          onChange={onChange}
        >
          {selectValue === "none" && (
            <MenuItem value="none" disabled={true}>
              Choose Method
            </MenuItem>
          )}
          {menuItems.map((item) => (
            <MenuItem key={item[0]} value={item[0]}>
              {item[1]}
            </MenuItem>
          ))}
        </Select>
      </FormControl>
      {editorVarbInfo && (
        <NumObjEntityEditor
          {...{
            className: "SelectEditor-editor",
            feVarbInfo: editorVarbInfo,
            labeled: false,
          }}
        />
      )}
      {rightOfControls ?? null}
      {equalsValue && (
        <div className="SelectEditor-equalsValue">{`= ${equalsValue}`}</div>
      )}
    </Styled>
  );
}

const Styled = styled.div`
  display: flex;
  margin-top: ${theme.s2};
  .SelectEditor-select {
    min-width: 0px;
  }
  .SelectEditor-equalsValue {
    display: flex;
    align-items: center;
    flex-wrap: nowrap;
    margin-left: ${theme.s2};
    white-space: nowrap;
  }
  .SelectEditor-formControl {
    border: solid 1px ${theme["gray-300"]};
    border-right: none;
    border-top-left-radius: ${theme.br0};
    .MuiSelect-root {
      padding: 9px 32px 9px 12px;
    }
    .MuiInputBase-root {
      height: 35px;
      border-top-right-radius: 0;
    }
  }

  .SelectEditor-noneSelected {
    color: ${theme["gray-600"]};
  }

  .SelectEditor-editor {
    .NumObjEditor-materialDraftEditor {
      .editor-background {
        border-top-left-radius: 0;
      }
      .MuiInputBase-root {
        min-width: 40px;
        border-top-left-radius: 0;
        padding-top: 0.5rem;
        padding-bottom: 0.5rem;
      }
    }
  }
`;
