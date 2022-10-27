import { PiCalculationName } from "../../baseSectionsVarbs/baseValues/calculations/piCalculations";
import { numObj } from "../../baseSectionsVarbs/baseValues/NumObj";
import { switchNames } from "../../baseSectionsVarbs/RelSwitchVarb";
import { loanVarbsNotInFinancing } from "../../baseSectionsVarbs/specialVarbNames";
import { relVarbInfoS } from "../../childSectionsDerived/RelVarbInfo";
import { relVarbInfosS } from "../../childSectionsDerived/RelVarbInfos";
import { relVarb, relVarbS } from "../rel/relVarb";
import { RelVarbs, relVarbsS } from "../relVarbs";

const loanBase = switchNames("loanBase", "dollarsPercentDecimal");
export function loanRelVarbs(): RelVarbs<"loan"> {
  return {
    ...relVarbsS._typeUniformity,
    ...relVarbsS.savableSection,
    [loanBase.switch]: relVarb("string", {
      initValue: "percent",
    }),
    [loanBase.decimal]: relVarbS.numObj("Base loan decimal", {
      initNumber: 0.05,
      unit: "decimal",
      updateFnName: "percentToDecimal",
      updateFnProps: { num: relVarbInfoS.local(loanBase.percent) },
      inUpdateSwitchProps: [
        {
          switchInfo: relVarbInfoS.local(loanBase.switch),
          switchValue: "dollars",
          updateFnName: "simpleDivide",
          updateFnProps: {
            leftSide: relVarbInfoS.local("loanBaseDollars"),
            rightSide: relVarbInfoS.pibling(
              "propertyGeneral",
              "propertyGeneral",
              "price",
              { expectedCount: "onlyOne" }
            ),
          },
        },
      ],
    }),
    // how do I get the switch to update the varbs?
    [loanBase.percent]: relVarbS.percentObj("Base loan", {
      displayNameEnd: " percent",
      updateFnName: "loadSolvableText",
      updateFnProps: {
        switch: relVarbInfoS.local(loanBase.switch),
        varbInfo: relVarbInfoS.local("loanBasePercentEditor"),
      },
      inUpdateSwitchProps: [
        {
          switchInfo: relVarbInfoS.local(loanBase.switch),
          switchValue: "dollars",
          updateFnName: "decimalToPercent",
          updateFnProps: {
            switch: relVarbInfoS.local(loanBase.switch),
            num: relVarbInfoS.local(loanBase.decimal),
          },
        },
      ],
    }),
    [loanBase.dollars]: relVarbS.moneyObj("Base loan", {
      displayNameEnd: " dollars",
      updateFnName: "loadSolvableText",
      updateFnProps: {
        switch: relVarbInfoS.local(loanBase.switch),
        varbInfo: relVarbInfoS.local("loanBaseDollarsEditor"),
      },
      inUpdateSwitchProps: [
        {
          switchInfo: relVarbInfoS.local(loanBase.switch),
          switchValue: "percent",
          updateFnName: "simpleMultiply",
          updateFnProps: {
            switch: relVarbInfoS.local(loanBase.switch),
            leftSide: relVarbInfoS.local(loanBase.decimal),
            rightSide: relVarbInfoS.pibling(
              "propertyGeneral",
              "propertyGeneral",
              "price",
              {
                expectedCount: "onlyOne",
              }
            ),
          },
        },
      ],
    }),
    loanBaseDollarsEditor: relVarbS.moneyObj("Loan amount", {
      initNumber: 0,
    }),
    loanBasePercentEditor: relVarbS.percentObj("Loan amount", {
      initNumber: 5,
    }),
    loanTotalDollars: relVarbS.sumMoney("Loan amount", [
      relVarbInfoS.local("loanBaseDollars"),
      relVarbInfoS.children("wrappedInLoanListGroup", "total"),
    ]),
    ...relVarbsS.ongoingInput("interestRatePercent", "Interest rate", {
      switchInit: "yearly",
      yearly: { endAdornment: "% annual" },
      monthly: { endAdornment: "% monthly" },
      shared: { unit: "percent" },
    }),
    ...relVarbsS.monthsYearsInput("loanTerm", "Loan term", {
      switchInit: "years",
      years: { initValue: numObj(30) },
    }),
    ...relVarbsS.timeMoneyInput("mortgageIns", "Mortgage insurance", {
      switchInit: "yearly",
      shared: { initNumber: 0 },
    }),
    ...relVarbsS.ongoingSumNums(
      "expenses",
      "Ongoing expenses",
      [relVarbInfoS.local("loanPayment"), relVarbInfoS.local("mortgageIns")],
      {
        switchInit: "monthly",
        shared: { startAdornment: "$" },
      }
    ),
    mortgageInsUpfront: relVarbS.moneyObj("Upfront mortgage insurance", {
      initNumber: 0,
    }),
    closingCosts: relVarbS.sumMoney("Closing costs", [
      relVarbInfoS.children("closingCostListGroup", "total"),
    ]),
    wrappedInLoan: relVarbS.sumMoney("Amount wrapped in loan", [
      relVarbInfoS.children("wrappedInLoanListGroup", "total"),
    ]),
    piCalculationName: relVarb("string", {
      initValue: "piFixedStandard" as PiCalculationName,
    }),
    ...relVarbsS.ongoingPureCalc(
      "interestRateDecimal",
      "interest rate decimal",
      {
        monthly: {
          updateFnName: "percentToDecimal",
          updateFnProps: {
            num: relVarbInfoS.local("interestRatePercentMonthly"),
          },
        },
        yearly: {
          updateFnName: "percentToDecimal",
          updateFnProps: {
            num: relVarbInfoS.local("interestRatePercentYearly"),
          },
        },
      },
      { shared: { unit: "decimal" } }
    ),
    ...relVarbsS.ongoingPureCalc(
      "interestOnlySimple",
      "Interest only loan payment",
      {
        monthly: {
          updateFnName: "yearlyToMonthly",
          updateFnProps: {
            num: relVarbInfoS.local("interestOnlySimpleYearly"),
          },
        },
        yearly: {
          updateFnName: "interestOnlySimpleYearly",
          updateFnProps: {
            ...relVarbInfosS.localByVarbName([
              "interestRateDecimalYearly",
              "loanTotalDollars",
            ]),
          },
        },
      },
      { shared: { startAdornment: "$", unit: "money" } }
    ),
    ...relVarbsS.ongoingPureCalc(
      "piFixedStandard",
      "Loan payment",
      {
        monthly: {
          updateFnName: "piFixedStandardMonthly",
          updateFnProps: relVarbInfosS.localByVarbName([
            "loanTotalDollars",
            "interestRateDecimalMonthly",
            "loanTermMonths",
          ]),
        },
        yearly: {
          updateFnName: "monthlyToYearly",
          updateFnProps: { num: relVarbInfoS.local("piFixedStandardMonthly") },
        },
      },
      { shared: { startAdornment: "$", unit: "money" } }
    ),
    ...relVarbsS.ongoingPureCalc(
      "loanPayment",
      "Loan payment",
      {
        monthly: {
          updateFnName: "loadNumObj",
          updateFnProps: {
            varbInfo: relVarbInfoS.local("piFixedStandardMonthly"),
          },
          inUpdateSwitchProps: [
            {
              switchInfo: relVarbInfoS.local("piCalculationName"),
              switchValue: "interestOnlySimple",
              updateFnName: "loadNumObj",
              updateFnProps: {
                varbInfo: relVarbInfoS.local("interestOnlySimpleMonthly"),
              },
            },
          ],
        },
        yearly: {
          updateFnName: "loadNumObj",
          updateFnProps: {
            varbInfo: relVarbInfoS.local("piFixedStandardYearly"),
          },
          inUpdateSwitchProps: [
            {
              switchInfo: relVarbInfoS.local("piCalculationName"),
              switchValue: "interestOnlySimple",
              updateFnName: "loadNumObj",
              updateFnProps: {
                varbInfo: relVarbInfoS.local("interestOnlySimpleYearly"),
              },
            },
          ],
        },
      },
      { shared: { startAdornment: "$", unit: "money" } }
    ),
  };
}

export const financingRelVarbs: RelVarbs<"financing"> = {
  ...relVarbsS.sumSection("loan", loanRelVarbs(), loanVarbsNotInFinancing),
  ...relVarbsS.sectionStrings("loan", loanRelVarbs(), loanVarbsNotInFinancing),
};
