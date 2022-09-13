import styled from "styled-components";
import { SectionName } from "../../../../../sharedWithServer/SectionsMeta/SectionName";
import { useAuthStatus } from "../../../../../sharedWithServer/stateClassHooks/useAuthStatus";
import theme from "../../../../../theme/Theme";
import DisplayNameSectionList from "../../../DisplayNameSectionList";
import { StoreSectionActionMenu } from "../StoreSectionActionMenu";

type Props = {
  sectionName: SectionName<"hasIndexStore">;
  feId: string;
  pluralName: string;
  xBtn?: boolean;
  dropTop?: boolean;
  className?: string;
  showActions?: boolean;
};
export function MainSectionMenus({
  pluralName,
  xBtn,
  dropTop,
  className,
  showActions = true,
  ...feInfo
}: Props) {
  const authStatus = useAuthStatus();
  const isGuest = authStatus === "guest";
  return (
    <Styled className={`MainSectionMenus-root ${className ?? ""}`}>
      {showActions && (
        <StoreSectionActionMenu
          {...{ ...feInfo, className: "MainSectionMenus-dropdownList" }}
        />
      )}
      <DisplayNameSectionList
        {...{
          className: "MainSectionMenus-dropdownList",
          feInfo,
          pluralName,
          disabled: isGuest,
          dropTop,
        }}
      />
    </Styled>
  );
}

const Styled = styled.div`
  display: flex;
  .MainSectionMenus-dropdownList {
    :not(:first-child) {
      margin-left: ${theme.s3};
    }
  }
`;

export const MainSectionMenusMini = styled(MainSectionMenus)`
  .MainSectionMenus-dropdownList {
    :not(:first-child) {
      margin-left: 0;
    }
  }

  .MainSectionMenus-dropdownList {
    margin-right: ${theme.s2};
  }
  .DropdownBtn-root {
    height: ${theme.smallButtonHeight};
  }
`;
