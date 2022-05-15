import React from "react";
import styled from "styled-components";
import { FeInfo, InfoS } from "../../../../sharedWithServer/SectionsMeta/Info";
import theme from "../../../../theme/Theme";
import BasicSectionInfo from "../../../appWide/GeneralSection/MainSection/MainSectionBody/BasicSectionInfo";
import StandardLabel from "../../../general/StandardLabel";
import NumObjEditor from "../../../inputs/NumObjEditor";
import DollarPercentRadioSwap from "../../general/DollarPercentRadioSwap";

type Props = { feInfo: FeInfo; className?: string };
export default function BasicLoanInfo({ feInfo, className }: Props) {
  const feVarbInfo = InfoS.feVarbMaker(feInfo);
  const names = {
    percent: "loanAmountBasePercent",
    dollars: "loanAmountBaseDollars",
    switch: "loanAmountBaseUnitSwitch",
  };
  return (
    <Styled
      {...{ className: `BasicLoanInfo-root ${className}`, sectionName: "loan" }}
    >
      <div className="viewable">
        <div className="BasicSectionInfo-subSections">
          <div className="BasicSectionInfo-subSection">
            <div className="BasicSectionInfo-subSection-viewable">
              <DollarPercentRadioSwap
                {...{
                  names,
                  feInfo,
                  title: "Base loan amount",
                  percentAdornment: "% LTV",
                  className: "BasicLoanInfo-radioSwap",
                }}
              />
            </div>
          </div>
          <div className="BasicSectionInfo-subSection">
            <div className="BasicSectionInfo-subSection-viewable">
              <div className="BasicSectionInfo-dualEditors BasicSectionInfo-editorBlock">
                <NumObjEditor
                  feVarbInfo={feVarbInfo("interestRatePercentYearly")}
                />
                <NumObjEditor
                  feVarbInfo={feVarbInfo("loanTermYears")}
                  label="Loan term"
                  className="BasicSectionInfo-numObjEditor secondEditor"
                />
              </div>
            </div>
          </div>
          <div className="BasicSectionInfo-subSection">
            <div className="BasicSectionInfo-subSection-viewable titledBlock">
              <div className="BasicSectionInfo-editorBlock titledBlock">
                <StandardLabel className="BasicSectionInfo-editorBlockTitle">
                  Mortgage Insurance
                </StandardLabel>
                <div className="BasicSectionInfo-dualEditors">
                  <NumObjEditor
                    feVarbInfo={feVarbInfo("mortInsUpfront")}
                    label="Upfront"
                  />
                  <NumObjEditor
                    feVarbInfo={feVarbInfo("mortgageInsYearly")}
                    label="Ongoing"
                    className="BasicSectionInfo-numObjEditor secondEditor"
                  />
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </Styled>
  );
}

const Styled = styled(BasicSectionInfo)`
  .BasicSectionInfo-dualEditors {
    display: flex;
    .DraftTextField-root {
      min-width: 95px;
    }
  }

  .BasicLoanInfo-radioSwap {
    .MuiInputBase-root {
      width: 158px;
    }
  }

  .BasicSectionInfo-numObjEditor.secondEditor {
    margin-left: ${theme.s2};
  }
`;
