import React from "react";
import { unstable_batchedUpdates } from "react-dom";
import styled from "styled-components";
import { useToggleViewNext } from "../../modules/customHooks/useToggleView";
import theme from "../../theme/Theme";
import { EditSectionBtn } from "./EditSectionBtn";
import { SectionModal } from "./SectionModal";
import { SelectEditor, SelectEditorProps } from "./SelectEditor";

interface Props extends SelectEditorProps {
  total: string;
  itemizeValue: string;
  itemsComponent: React.ReactNode;
  itemizedModalTitle: string;
}

export function SelectAndItemizeEditor({
  total,
  itemsComponent,
  onChange,
  rightOfControls,
  itemizeValue,
  itemizedModalTitle,
  ...rest
}: Props) {
  const { itemsIsOpen, closeItems, openItems } = useToggleViewNext(
    "items",
    false
  );

  const isItemized = rest.selectValue === itemizeValue;
  return (
    <Styled>
      <SelectEditor
        {...{
          onChange: (e) => {
            unstable_batchedUpdates(() => {
              onChange && onChange(e);
              e.target.value === itemizeValue && openItems();
            });
          },
          ...rest,
          rightOfControls:
            rightOfControls ||
            (isItemized && (
              <>
                <div className="SelectAndItemizeEditor-itemizedTotalDiv">{`Total = ${total}`}</div>
                <EditSectionBtn
                  className="SelectAndItemizeEditor-editBtn"
                  onClick={openItems}
                />
                <SectionModal
                  title={itemizedModalTitle}
                  closeModal={closeItems}
                  show={itemsIsOpen}
                >
                  {itemsComponent}
                </SectionModal>
              </>
            )),
        }}
      />
    </Styled>
  );
}

// If you try to just use a Styled SelectEditor, these css selectors won't work.
const Styled = styled.div`
  .SelectAndItemizeEditor-itemizedTotalDiv {
    margin-left: ${theme.s3};
    display: flex;
    align-items: center;
  }
  .SelectAndItemizeEditor-editBtn {
    margin-left: ${theme.s2};
  }
`;