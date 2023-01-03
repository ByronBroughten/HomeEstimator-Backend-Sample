import styled from "styled-components";
import { useSetterSection } from "../../sharedWithServer/stateClassHooks/useSetterSection";
import theme from "../../theme/Theme";
import { ValueSectionGeneric } from "./ValueSectionGeneric";
import { VarbListOngoing } from "./VarbLists/VarbListOngoing";

interface Props {
  className?: string;
  feId: string;
  displayName?: string;
}

export function ValueOngoingSection({ feId, ...rest }: Props) {
  const section = useSetterSection({
    sectionName: "ongoingValue",
    feId,
  });
  const valueName = section.get.switchVarbName(
    "value",
    "ongoing"
  ) as "valueMonthly";
  return (
    <ValueSectionGeneric
      {...{
        ...rest,
        sectionName: "ongoingValue",
        feId,
        valueName,
        makeItemizedListNode: (props) => <VarbListOngoing {...props} />,
      }}
    />
  );
}

const Styled = styled.div`
  .ValueOngoingSection-viewable {
    height: ${theme.valueSectionSize};
    display: inline-block;
    border: solid 1px ${theme.primaryBorder};
    background: ${theme.light};
    border-radius: ${theme.br0};
    padding: ${theme.sectionPadding};
  }
  .ValueOngoingSection-editItemsBtn {
    color: ${theme.primaryNext};
  }

  .ValueOngoingSection-itemizeControls {
    display: flex;
    align-items: flex-end;
  }
  .ValueOngoingSection-itemizeGroup {
    margin-top: ${theme.s2};
    margin-left: ${theme.s25};
    .MuiFormControlLabel-root {
      margin-right: ${theme.s2};
      color: ${theme.primaryNext};

      .MuiSwitch-colorPrimary {
        color: ${theme["gray-500"]};
      }

      .MuiSwitch-colorPrimary.Mui-checked {
        color: ${theme.primaryNext};
      }
    }
  }

  .ValueOngoingSection-value {
    display: flex;
    flex-direction: column;
    justify-content: center;
    margin-top: ${theme.s3};
    height: 25px;
  }

  .ValueOngoingSection-valueEditor {
    .DraftTextField-root {
      min-width: 100px;
    }
  }
`;
