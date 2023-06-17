import { Box, FormControl, FormControlLabel, RadioGroup } from "@mui/material";
import styled from "styled-components";
import { StateValue } from "../../../../sharedWithServer/SectionsMeta/values/StateValue";
import { useAction } from "../../../../sharedWithServer/stateClassHooks/useAction";
import { useGetterSection } from "../../../../sharedWithServer/stateClassHooks/useGetterSection";
import { nativeTheme } from "../../../../theme/nativeTheme";
import theme from "../../../../theme/Theme";
import { FormSection } from "../../../appWide/FormSection";
import { SubSectionBtn } from "../../../appWide/GeneralSection/GeneralSectionTitle/SubSectionBtn";
import { PageTitle } from "../../../appWide/PageTitle";
import Radio from "../../../general/Radio";
import { Loan } from "./FinancingEditor/Loan";

type Props = {
  feId: string;
  dealMode: StateValue<"dealMode">;
};

export function PurchaseFinancingEditor({ feId }: Props) {
  const addChild = useAction("addChild");
  const updateValue = useAction("updateValue");

  const financing = useGetterSection({
    sectionName: "financing",
    feId,
  });

  const addLoan = () =>
    addChild({
      feInfo: financing.feInfo,
      childName: "loan",
    });

  const loanIds = financing.childFeIds("loan");
  const financingModeVarb = financing.varb("financingMethod");
  const financingMethod = financing.value("financingMethod");
  const values: Record<string, StateValue<"financingMethod">> = {
    cashOnly: "cashOnly",
    useLoan: "useLoan",
  };

  return (
    <Styled>
      <div className="Financing-titleRow">
        <PageTitle text={"Financing"} />
      </div>
      <FormSection>
        <Box
          sx={{
            display: "flex",
            flexDirection: "column",
            flex: 1,
          }}
        >
          <div>
            <FormControl
              className="Financing-financingTypeControl"
              sx={{
                m: 0,
                p: 0,
                mt: nativeTheme.s2,
              }}
            >
              <RadioGroup
                aria-labelledby="financing-type-radio-buttons-group"
                name="financing-type-radio-buttons-group"
                value={financingMethod}
                onChange={(e) =>
                  updateValue({
                    ...financingModeVarb.feVarbInfo,
                    value: e.currentTarget.value,
                  })
                }
              >
                <FormControlLabel
                  value={values.cashOnly}
                  control={<Radio color="primary" />}
                  label="Cash Only"
                />
                <FormControlLabel
                  value={values.useLoan}
                  control={<Radio color="primary" />}
                  label="Use Loan(s)"
                />
              </RadioGroup>
            </FormControl>
          </div>
          {financingMethod === "useLoan" && (
            <Box
              sx={{
                display: "flex",
                flexDirection: "column",
                flex: 1,
              }}
            >
              <div className={"Financing-loans"}>
                {loanIds.map((feId, idx) => (
                  <Loan
                    key={feId}
                    feId={feId}
                    sx={idx !== 0 ? { mt: nativeTheme.s4 } : undefined}
                    showXBtn={loanIds.length > 1}
                  />
                ))}
              </div>
              <SubSectionBtn
                sx={{
                  fontSize: nativeTheme.chunkTitleFs,
                  mt: nativeTheme.s45,
                  height: "80px",
                }}
                onClick={addLoan}
                middle="+ Loan"
              />
            </Box>
          )}
        </Box>
      </FormSection>
    </Styled>
  );
}

const Styled = styled.div`
  .Financing-inputDiv {
    /* display: flex;
    flex-direction: column;
    flex: 1; */
  }
  .Financing-financingTypeControl {
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
  .Financing-loans {
    margin-top: ${theme.s4};
  }
`;