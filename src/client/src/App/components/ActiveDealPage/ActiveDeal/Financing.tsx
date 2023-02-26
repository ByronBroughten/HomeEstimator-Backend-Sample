import { FormControl, FormControlLabel, RadioGroup } from "@material-ui/core";
import styled from "styled-components";
import { useSetterSection } from "../../../sharedWithServer/stateClassHooks/useSetterSection";
import { GetterSection } from "../../../sharedWithServer/StateGetters/GetterSection";
import { StrictOmit } from "../../../sharedWithServer/utils/types";
import { FormSection } from "../../appWide/FormSection";
import { SubSectionBtn } from "../../appWide/GeneralSection/GeneralSectionTitle/SubSectionBtn";
import { SectionTitle } from "../../appWide/SectionTitle";
import Radio from "../../general/Radio";
import theme from "./../../../theme/Theme";
import { BackToSectionBtn } from "./BackToSectionBtn";
import { Loan } from "./Financing/Loan";
import { MainDealSectionProps, MainSubSectionFull } from "./MainSubSectionFull";

function getDisplayName(financing: GetterSection<"financing">) {
  const financingMode = financing.valueNext("financingMode");
  if (financingMode === "cashOnly") {
    return "Cash Only";
  }

  const loans = financing.children("loan");
  let displayName = "";
  for (let i = 0; i < loans.length; i++) {
    if (i !== 0) displayName += " | ";
    displayName += loans[i].valueNext("displayName").mainText;
  }
  return displayName;
}

export function Financing({
  feId,
  closeInputs,
  completionStatus,
  ...props
}: StrictOmit<
  MainDealSectionProps & { feId: string },
  "displayName" | "sectionTitle" | "detailVarbPropArr"
>) {
  const financing = useSetterSection({
    sectionName: "financing",
    feId,
  });

  const financingModeVarb = financing.varb("financingMode");
  const financingMode = financingModeVarb.value("string");

  const loanIds = financing.childFeIds("loan");
  const addLoan = () => financing.addChild("loan");

  return (
    <Styled
      {...{
        ...props,
        feId,
        sectionTitle: "Financing",
        className: "Financing-root",
        closeInputs,
        displayName: getDisplayName(financing.get),
        completionStatus,
        detailVarbPropArr: financing.get.varbInfoArr([
          "loanPaymentMonthly",
          "loanTotalDollars",
          // "downPayment"
        ] as const),
      }}
    >
      <div className="Financing-titleRow">
        <SectionTitle
          text={"Financing"}
          className="MainSectionTopRows-sectionTitle"
        />
        <BackToSectionBtn backToWhat="Deal" onClick={closeInputs} />
      </div>
      <FormSection>
        <div className="Financing-inputDiv">
          <FormControl className="Financing-financingTypeControl">
            <RadioGroup
              aria-labelledby="financing-type-radio-buttons-group"
              name="financing-type-radio-buttons-group"
              value={financingMode}
              onChange={(e) =>
                financingModeVarb.updateValue(e.currentTarget.value)
              }
            >
              <FormControlLabel
                value="cashOnly"
                control={<Radio color="primary" />}
                label="Cash Only"
              />
              <FormControlLabel
                value="useLoan"
                control={<Radio color="primary" />}
                label="Use Loan(s)"
              />
            </RadioGroup>
          </FormControl>
          {financingMode === "useLoan" && (
            <>
              <div className={"Financing-loans"}>
                {loanIds.map((feId, idx) => (
                  <Loan
                    key={feId}
                    feId={feId}
                    className={idx !== 0 ? "Financing-marginLoan" : ""}
                    showXBtn={loanIds.length > 1}
                  />
                ))}
              </div>
              <SubSectionBtn
                className="Financing-addLoanBtn"
                onClick={addLoan}
                text="+ Loan"
              />
            </>
          )}
        </div>
      </FormSection>
    </Styled>
  );
}

const Styled = styled(MainSubSectionFull)`
  .Financing-inputDiv {
    display: flex;
    flex-direction: column;
    flex: 1;
  }
  .Financing-financingTypeControl {
    margin: 0;
    padding: 0;
    margin-top: ${theme.s2};

    .MuiFormLabel-root {
      font-size: ${theme.infoSize};
      color: ${theme.dark};
    }
    .MuiFormControlLabel-label {
      margin-left: ${theme.s25};
    }
    .MuiFormControlLabel-root {
      margin: 0;
      margin-top: ${theme.s15};
    }
    .Mui-checked {
      color: ${theme.primaryNext};
    }
  }
  .Financing-titleRow {
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding-bottom: ${theme.s3};
  }
  .Financing-marginLoan,
  .Financing-addLoanBtn {
    margin-top: ${theme.s3};
  }

  .Financing-loans {
    margin-top: ${theme.s4};
  }
`;
