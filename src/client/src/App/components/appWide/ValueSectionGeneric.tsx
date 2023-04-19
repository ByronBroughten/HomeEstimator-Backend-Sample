import React from "react";
import styled from "styled-components";
import { VarbName } from "../../sharedWithServer/SectionsMeta/baseSectionsDerived/baseSectionsVarbsTypes";
import { ChildName } from "../../sharedWithServer/SectionsMeta/sectionChildrenDerived/ChildName";
import { SectionNameByType } from "../../sharedWithServer/SectionsMeta/SectionNameByType";
import { StateValue } from "../../sharedWithServer/SectionsMeta/values/StateValue";
import { validateStateValue } from "../../sharedWithServer/SectionsMeta/values/valueMetas";
import { useAction } from "../../sharedWithServer/stateClassHooks/useAction";
import { useGetterSection } from "../../sharedWithServer/stateClassHooks/useGetterSection";
import theme from "../../theme/Theme";
import { BigStringEditor } from "../inputs/BigStringEditor";
import { NumObjEntityEditor } from "../inputs/NumObjEntityEditor";
import { RemoveSectionXBtn } from "./RemoveSectionXBtn";
import { SectionTitle } from "./SectionTitle";
import { SelectAndItemizeEditor } from "./SelectAndItemizeEditor";

type ValueSectionName = SectionNameByType<"valueSection">;
type MakeItemizedListNodeProps = {
  feId: string;
};
interface Props<SN extends ValueSectionName> {
  sectionName: SN;
  valueName: VarbName<SN>;
  valueEditorName: VarbName<SN>;
  makeItemizedListNode: (props: MakeItemizedListNodeProps) => React.ReactNode;
  className?: string;
  feId: string;
  displayName?: string;
  showXBtn?: boolean;
}

function getChildName<SN extends ValueSectionName>(
  sectionName: SN
): ChildName<SN> {
  if (sectionName === "ongoingValue") return "ongoingList" as ChildName<SN>;
  else return "singleTimeList" as ChildName<SN>;
}

export function ValueSectionGeneric<
  SN extends SectionNameByType<"valueSection">
>({
  valueEditorName,
  className,
  feId,
  displayName,
  sectionName,
  valueName,
  makeItemizedListNode,
  showXBtn = true,
}: Props<SN>) {
  const feInfo = { sectionName, feId } as const;
  const updateValue = useAction("updateValue");
  const section = useGetterSection(feInfo);
  const listChildName = getChildName(sectionName);
  const valueSource = section.valueNext("valueSourceName");
  const displayNameValue = section.valueNext("displayName").mainText;

  const menuItems: [StateValue<"customValueSource">, string][] = [
    ["valueEditor", "Enter amount"],
    ["listTotal", "Itemize"],
  ];

  return (
    <Styled className={`ValueSection-root ${className ?? ""}`}>
      <div className={"ValueSection-viewable"}>
        <div className="ValueSection-titleRow">
          {displayName && <SectionTitle text={displayName} />}
          {!displayName && (
            <BigStringEditor
              {...{
                className: "ValueSection-nameEditor",
                feVarbInfo: section.varbInfo("displayNameEditor"),
                placeholder: "Name",
              }}
            />
          )}
          {showXBtn && (
            <RemoveSectionXBtn
              className="ValueSection-xBtn"
              {...section.feInfo}
            />
          )}
        </div>
        <SelectAndItemizeEditor
          {...{
            selectValue: valueSource,
            makeEditor:
              valueSource === "valueEditor"
                ? (props) => (
                    <NumObjEntityEditor
                      {...{
                        ...props,
                        feVarbInfo: section.varbInfo(valueEditorName),
                        quickViewVarbNames: [
                          "purchasePrice",
                          "sqft",
                          "numUnits",
                        ],
                      }}
                    />
                  )
                : undefined,
            menuItems,
            onChange: (e) => {
              updateValue({
                ...feInfo,
                varbName: "valueSourceName",
                value: validateStateValue(e.target.value, "customValueSource"),
              });
            },
            total: section.varbNext(valueName).displayVarb(),
            itemizeValue: "listTotal",
            itemizedModalTitle: displayNameValue,
            itemsComponent: makeItemizedListNode({
              feId: section.onlyChild(listChildName).feId,
            }),
          }}
        />
      </div>
    </Styled>
  );
}

const Styled = styled.div`
  .ValueSection-viewable {
    .ValueSection-xBtn {
      visibility: hidden;
    }
    :hover {
      .ValueSection-xBtn {
        visibility: visible;
      }
    }

    display: inline-block;
    border: solid 1px ${theme.primaryBorder};
    background: ${theme.light};
    border-radius: ${theme.br0};
    padding: ${theme.sectionPadding};
  }

  .ValueSection-value {
    display: flex;
    flex-direction: column;
    justify-content: center;
    margin-top: ${theme.s3};
    height: 25px;
  }

  .ValueSection-xBtn {
    height: 22px;
    width: 22px;
  }

  .ValueSection-titleRow {
    display: flex;
    justify-content: space-between;
  }

  .ValueSection-nameEditor {
    .DraftTextField-root {
      min-width: 150px;
    }
  }
  .ValueSection-valueEditor {
    .DraftTextField-root {
      min-width: 100px;
    }
  }

  .ValueSection-xBtn {
    margin-left: ${theme.s3};
  }

  .ValueSection-editItemsBtn {
    margin-left: ${theme.s2};
    color: ${theme.primaryNext};
  }

  .ValueSection-itemizeControls {
    display: flex;
    align-items: flex-end;
  }
  .ValueSection-itemizeGroup {
    margin-top: ${theme.s2};
  }
`;
