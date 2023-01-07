import React from "react";
import styled from "styled-components";
import { SectionNameByType } from "../../sharedWithServer/SectionsMeta/SectionNameByType";
import theme from "../../theme/Theme";
import { MainSectionTitleRow } from "./GeneralSection/MainSection/MainSectionTitleRow";
import { MainSectionActionRow } from "./GeneralSection/MainSection/MainSectionTitleRow/MainSectionActionRow";
import { useSaveStatus } from "./GeneralSection/MainSection/useSaveStatus";
import { RemoveSectionXBtn } from "./RemoveSectionXBtn";
import { SectionTitle } from "./SectionTitle";

type Props = {
  className?: string;
  sectionTitle: string;
  sectionName: SectionNameByType<"hasCompareTable">;
  feId: string;
  loadWhat: string;
  belowTitle?: React.ReactNode;
  showXBtn?: boolean;
};
export function MainSectionTopRows({
  className,
  sectionTitle,
  loadWhat,
  belowTitle,
  showXBtn,
  ...feInfo
}: Props) {
  const saveStatus = useSaveStatus(feInfo);
  return (
    <Styled className={`MainSectionTopRows-root ${className ?? ""}`}>
      <div className="MainSectionTopRows-leftBlock">
        <SectionTitle
          text={sectionTitle}
          className="MainSectionTopRows-sectionTitle"
        />
        {belowTitle ?? null}
      </div>
      <div className="MainSectionTopRows-controls">
        <MainSectionTitleRow
          {...{
            ...feInfo,
            sectionTitle,
            className: "MainSectionTopRows-titleRow",
          }}
        />
        <MainSectionActionRow
          {...{
            ...feInfo,
            loadWhat,
            xBtn: false,
            dropTop: false,
            saveStatus,
            className: "MainSectionTopRows-sectionMenus",
          }}
        />
      </div>
      {showXBtn && (
        <div className="MainSectionTopRows-rightBlock">
          <RemoveSectionXBtn className="MainSectionTopRows-xBtn" {...feInfo} />
        </div>
      )}
    </Styled>
  );
}

const Styled = styled.div`
  display: flex;
  align-items: center;
  .MainSectionTopRows-leftBlock {
    /* width: 130px; */
    color: ${theme.primary};
  }
  .MainSectionTopRows-sectionTitle {
    font-size: ${"22px"};
  }
  .MainSectionTopRows-controls {
    display: flex;
    flex-direction: column;
    flex: 1;
    margin-left: ${theme.s4};
  }

  .MainSectionTopRows-rightBlock {
    height: 55px;
    display: flex;
    flex-direction: column;
    flex: 1;
    justify-content: flex-start;
    align-items: flex-end;
  }
  .MainSectionTopRows-xBtn {
    height: ${theme.bigButtonHeight};
    width: ${theme.bigButtonHeight};
  }

  .MainSectionTopRows-sectionMenus {
    margin-top: ${theme.s25};
  }
`;
