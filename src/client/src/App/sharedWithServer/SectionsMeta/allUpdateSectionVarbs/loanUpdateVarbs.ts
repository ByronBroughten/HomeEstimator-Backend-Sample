import { relVarbInfoS } from "../SectionInfo/RelVarbInfo";
import { UpdateSectionVarbs } from "../updateSectionVarbs/updateSectionVarbs";
import { updateVarb, uvS } from "../updateSectionVarbs/updateVarb";
import {
  ubS,
  UpdateBasics,
  updateBasics,
} from "../updateSectionVarbs/updateVarb/UpdateBasics";
import { updateFnPropsS } from "../updateSectionVarbs/updateVarb/UpdateFnProps";
import {
  uO,
  updateOverride,
} from "../updateSectionVarbs/updateVarb/UpdateOverride";
import { uosS } from "../updateSectionVarbs/updateVarb/UpdateOverrides";
import { osS } from "../updateSectionVarbs/updateVarb/UpdateOverrideSwitch";
import { updateVarbsS } from "../updateSectionVarbs/updateVarbs";
import { numObj } from "../values/StateValue/NumObj";
import { unionValueArr } from "../values/StateValue/unionValues";
import { PiCalculationName } from "../values/StateValue/valuesShared/calculations/piCalculations";
import { upS } from "./../updateSectionVarbs/updateVarb/UpdateFnProps";

export function loanUpdateVarbs(): UpdateSectionVarbs<"loan"> {
  return {
    ...updateVarbsS._typeUniformity,
    completionStatus: loanCompletionStatus(),
    ...updateVarbsS.savableSection,
    financingMode: updateVarb("financingMode"),
    loanBaseDollars: uvS.loadNumObjChild("loanBaseValue", "valueDollars"),
    ...updateVarbsS.periodicInput("interestRatePercent", {
      switchInit: "yearly",
    }),
    ...updateVarbsS.monthsYearsInput("loanTerm", "years", {
      years: { initValue: numObj(30) },
    }),
    // investmentExpenses = upfrontExpenses, delayedExpenses
    // cashExpenses = upfrontExpenses, prepaidExpenses

    prepaidTaxes: loanPrepaidPeriodic("taxes"),
    prepaidHomeIns: loanPrepaidPeriodic("homeIns"),
    prepaidInterest: uvS.vsChildNumObj("prepaidInterest", "spanOrDollars", {
      valueDollarsEditor: ubS.loadChild(
        "prepaidInterest",
        "valueDollarsEditor"
      ),
      valueSpanEditor: ubS.multiply(
        "firstInterestPayment",
        upS.children("prepaidInterest", "valueSpanEditor")
      ),
    }),
    prepaidTotal: uvS.numObjB2(
      ubS.sumNums("prepaidTaxes", "prepaidHomeIns", "prepaidInterest")
    ),
    isInterestOnly: updateVarb("boolean", {
      initValue: false,
    }),
    hasMortgageIns: updateVarb("boolean", {
      initValue: false,
    }),
    mortgageInsUpfront: uvS.numObjO([
      updateOverride([osS.localIsFalse("hasMortgageIns")], ubS.zero),
      ...uosS.valueSource(
        "mortgageInsUpfrontSource",
        {
          valueDollarsEditor: ubS.loadChild(
            "mortgageInsUpfrontValue",
            "valueDollarsEditor"
          ),
          percentLoanEditor: ubS.equationLR(
            "multiply",
            upS.local("loanTotalDollars"),
            upS.onlyChild("mortgageInsUpfrontValue", "decimalOfLoan")
          ),
        },
        {
          sharedSwitches: [osS.localIsTrue("hasMortgageIns")],
          switchInfo: relVarbInfoS.onlyChild(
            "mortgageInsUpfrontValue",
            "valueSourceName"
          ),
        }
      ),
    ]),
    ...updateVarbsS.group("mortgageIns", "periodic", "yearly", {
      monthly: {
        updateOverrides: [
          updateOverride([osS.localIsFalse("hasMortgageIns")], ubS.zero),
          ...uosS.valueSource(
            "mortgageInsperiodic",
            {
              valueDollarsPeriodicEditor: ubS.loadChild(
                "mortgageInsPeriodicValue",
                "valueDollarsMonthly"
              ),
              percentLoanPeriodicEditor: ubS.equationLR(
                "multiply",
                upS.onlyChild(
                  "mortgageInsPeriodicValue",
                  "decimalOfLoanMonthly"
                ),
                upS.local("loanTotalDollars")
              ),
            },
            {
              sharedSwitches: [osS.localIsTrue("hasMortgageIns")],
              switchInfo: relVarbInfoS.onlyChild(
                "mortgageInsPeriodicValue",
                "valueSourceName"
              ),
            }
          ),
        ],
      },
      yearly: {
        updateOverrides: [
          updateOverride([osS.localIsFalse("hasMortgageIns")], ubS.zero),
          ...uosS.valueSource(
            "mortgageInsperiodic",
            {
              valueDollarsPeriodicEditor: ubS.loadChild(
                "mortgageInsPeriodicValue",
                "valueDollarsYearly"
              ),
              percentLoanPeriodicEditor: ubS.equationLR(
                "multiply",
                "loanTotalDollars",
                upS.onlyChild("mortgageInsPeriodicValue", "decimalOfLoanYearly")
              ),
            },
            {
              sharedSwitches: [osS.localIsTrue("hasMortgageIns")],
              switchInfo: relVarbInfoS.onlyChild(
                "mortgageInsPeriodicValue",
                "valueSourceName"
              ),
            }
          ),
        ],
      },
    }),
    firstInterestPayment: uvS.multiply(
      "interestRateDecimalMonthly",
      "loanTotalDollars"
    ),
    firstInterestPaymentOneDay: uvS.divide(
      "firstInterestPayment",
      upS.varbPathName("thirty")
    ),
    // prepaidDaily: uvS.numObj({
    //   updateOverrides: updateOver
    // }),
    loanTotalDollars: uvS.sumNums([upS.local("loanBaseDollars")]),
    ...updateVarbsS.ongoingSumNums(
      "expenses",
      [upS.localBaseName("loanPayment"), upS.localBaseName("mortgageIns")],
      "monthly"
    ),
    fivePercentBaseLoan: uvS.numEquation(
      "fivePercent",
      upS.local("loanBaseDollars")
    ),
    closingCosts: uvS.numObjO([
      updateOverride(
        [osS.childValueSourceIs("closingCostValue", "fivePercentLoan")],
        ubS.loadSolvableTextByVarbInfo("fivePercentBaseLoan")
      ),
      updateOverride(
        [
          osS.childValueSourceIs(
            "closingCostValue",
            ...unionValueArr("closingCostValueSource")
          ),
        ],
        ubS.sumNums(upS.children("closingCostValue", "valueDollars"))
      ),
    ]),
    piCalculationName: updateVarb("string", {
      initValue: "piFixedStandard" as PiCalculationName,
    }),
    ...updateVarbsS.ongoingPureCalc("interestRateDecimal", {
      monthly: {
        updateFnName: "percentToDecimal",
        updateFnProps: {
          num: upS.local("interestRatePercentMonthly"),
        },
      },
      yearly: {
        updateFnName: "percentToDecimal",
        updateFnProps: {
          num: upS.local("interestRatePercentYearly"),
        },
      },
    }),
    ...updateVarbsS.ongoingPureCalc("interestOnlySimple", {
      monthly: {
        updateFnName: "yearlyToMonthly",
        updateFnProps: {
          num: upS.local("interestOnlySimpleYearly"),
        },
      },
      yearly: {
        updateFnName: "piInterestOnlySimpleYearly",
        updateFnProps: {
          ...updateFnPropsS.localByVarbName([
            "interestRateDecimalYearly",
            "loanTotalDollars",
          ]),
        },
      },
    }),

    ...updateVarbsS.ongoingPureCalc("averagePrincipal", {
      monthly: {
        updateFnName: "throwIfReached",
        updateOverrides: [
          updateOverride([osS.localIsTrue("isInterestOnly")], ubS.zero),
          updateOverride(
            [osS.localIsFalse("isInterestOnly")],
            ubS.equationLR(
              "divide",
              upS.local("loanTotalDollars"),
              upS.local("loanTermMonths")
            )
          ),
        ],
      },
      yearly: {
        updateFnName: "throwIfReached",
        updateOverrides: [
          updateOverride([osS.localIsTrue("isInterestOnly")], ubS.zero),
          updateOverride(
            [osS.localIsFalse("isInterestOnly")],
            ubS.equationLR(
              "divide",
              upS.local("loanTotalDollars"),
              upS.local("loanTermYears")
            )
          ),
        ],
      },
    }),
    ...updateVarbsS.ongoingPureCalc("averageInterest", {
      monthly: ubS.equationLR(
        "subtract",
        upS.local("loanPaymentMonthly"),
        upS.local("averagePrincipalMonthly")
      ),
      yearly: ubS.equationLR(
        "subtract",
        upS.local("loanPaymentYearly"),
        upS.local("averagePrincipalYearly")
      ),
    }),
    ...updateVarbsS.ongoingPureCalc("piFixedStandard", {
      monthly: {
        updateFnName: "piFixedStandardMonthly",
        updateFnProps: updateFnPropsS.localByVarbName([
          "loanTotalDollars",
          "interestRateDecimalMonthly",
          "loanTermMonths",
        ]),
      },
      yearly: {
        updateFnName: "monthlyToYearly",
        updateFnProps: { num: upS.local("piFixedStandardMonthly") },
      },
    }),
    ...updateVarbsS.ongoingPureCalc("loanPayment", {
      monthly: {
        updateFnName: "throwIfReached",
        updateOverrides: [
          updateOverride(
            [osS.local("isInterestOnly", false)],
            ubS.loadLocal("piFixedStandardMonthly") as UpdateBasics<"numObj">
          ),
          updateOverride(
            [osS.local("isInterestOnly", true)],
            updateBasics("loadNumObj", {
              varbInfo: upS.local("interestOnlySimpleMonthly"),
            })
          ),
        ],
      },
      yearly: {
        updateFnName: "throwIfReached",
        updateOverrides: [
          updateOverride(
            [osS.local("isInterestOnly", false)],
            ubS.loadLocal("piFixedStandardYearly") as UpdateBasics<"numObj">
          ),
          updateOverride(
            [osS.local("isInterestOnly", true)],
            updateBasics("loadNumObj", {
              varbInfo: upS.local("interestOnlySimpleYearly"),
            })
          ),
        ],
      },
    }),
  };
}

function loanPrepaidPeriodic(baseName: "taxes" | "homeIns") {
  const childNames = {
    taxes: "prepaidTaxes",
    homeIns: "prepaidHomeIns",
  } as const;
  const childName = childNames[baseName];
  return uvS.numObjO([
    uO(
      [
        osS.childValueSourceIs(childName, "valueSpanEditor"),
        osS.local("financingMode", "purchase"),
        osS.varbIsValue("dealMode", "brrrr", "fixAndFlip"),
      ],
      ubS.multiply(
        upS.children(childName, "valueMonths"),
        upS.varbPathName(`${baseName}HoldingMonthly`)
      )
    ),
    uO(
      [osS.childValueSourceIs(childName, "valueSpanEditor")],
      ubS.multiply(
        upS.children(childName, "valueMonths"),
        upS.varbPathName(`${baseName}OngoingMonthly`)
      )
    ),
    uO(
      [osS.childValueSourceIs(childName, "valueDollarsEditor")],
      ubS.loadChild(childName, "valueDollarsEditor")
    ),
  ]);
}

function loanCompletionStatus() {
  return uvS.basic(
    "completionStatus",
    "completionStatus",
    ubS.completionStatus({
      othersValid: [upS.onlyChild("loanBaseValue", "completionStatus")],
      nonNone: [upS.onlyChild("closingCostValue", "valueSourceName")],
      validInputs: [
        upS.local("interestRatePercentPeriodicEditor"),
        upS.local("loanTermSpanEditor"),
        upS.onlyChild("closingCostValue", "valueDollarsEditor", [
          osS.valueSourceIs("valueDollarsEditor"),
        ]),
      ],
    })
  );
}
