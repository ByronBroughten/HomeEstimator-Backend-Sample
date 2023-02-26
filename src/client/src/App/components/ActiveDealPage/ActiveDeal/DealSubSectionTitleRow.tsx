import React from "react";
import { FaPlay } from "react-icons/fa";
import styled from "styled-components";
import { CompletionStatus } from "../../../sharedWithServer/SectionsMeta/values/StateValue/subStringValues";
import { nativeTheme } from "../../../theme/nativeTheme";
import { CheckMarkCircle } from "../../appWide/checkMarkCircle";
import { EditSectionBtn } from "../../appWide/EditSectionBtn";
import { SectionTitle } from "../../appWide/SectionTitle";
import { DomLink } from "./general/DomLink";
import { MainSectionLargeEditBtn } from "./MainSectionLargeEditBtn";

type Props = {
  completionStatus: CompletionStatus;
  sectionTitle: React.ReactNode;
  editorPath?: string;
  openEditor?: () => void;
};

export function DealSubSectionTitleRow({
  completionStatus,
  sectionTitle,
  editorPath,
  openEditor,
}: Props) {
  const btnText = completionStatus === "allEmpty" ? "Start" : "Continue";
  const isCompleted = completionStatus === "allValid";
  return (
    <Styled>
      <CheckMarkCircle
        {...{
          checked: isCompleted,
          className: "DealSubSectionTitleRow-checkmarkCircle",
        }}
      />
      <SectionTitle
        className="DealSubSectionTitleRow-showInputsTitle"
        text={sectionTitle}
      />
      {!isCompleted && (
        <DomLink to={editorPath ?? ""}>
          <MainSectionLargeEditBtn
            {...{
              className: "DealSubSectionTitleRow-startBtn",
              middle: btnText,
              right: <FaPlay className="DealSubSectionTitleRow-startIcon" />,
              onClick: openEditor,
            }}
          />
        </DomLink>
      )}
      {isCompleted && (
        <DomLink to={editorPath ?? ""}>
          <EditSectionBtn
            className="DealSubSectionTitleRow-editBtn"
            onClick={openEditor}
          />
        </DomLink>
      )}
    </Styled>
  );
}

const Styled = styled.div`
  display: flex;
  flex: 1;
  align-items: center;

  .DealSubSectionTitleRow-checkmarkCircle {
    margin-right: ${nativeTheme.s3};
  }

  .DealSubSectionTitleRow-startIcon {
    margin-left: ${nativeTheme.s15};
  }

  .DealSubSectionTitleRow-showInputsTitle {
    color: ${nativeTheme.primary.main};
    min-width: 110px;
  }

  .DealSubSectionTitleRow-editBtn {
    margin-left: ${nativeTheme.s1};
  }
`;
