import { switchNames } from "../../baseSectionsUtils/RelSwitchVarb";
import { relVarbInfoS } from "../../childSectionsDerived/RelVarbInfo";
import { relVarbInfosS } from "../../childSectionsDerived/RelVarbInfos";
import { relUpdateSwitch } from "../rel/relUpdateSwitch";
import { relVarb, relVarbS } from "../rel/relVarb";
import { RelVarbs, relVarbsS } from "../relVarbs";

const rentCut = switchNames("rentCut", "dollarsPercentDecimal");
const rentCutDollars = switchNames(rentCut.dollars, "ongoing");

export function mgmtRelVarbs(): RelVarbs<"mgmt"> {
  return {
    ...relVarbsS._typeUniformity,
    ...relVarbsS.savableSection,
    [rentCut.switch]: relVarb("string", {
      initValue: "percent",
    }),
    [rentCut.decimal]: relVarbS.numObj("Rent cut decimal", {
      initNumber: 0.05,
      updateFnName: "percentToDecimal",
      updateFnProps: {
        num: relVarbInfoS.local(rentCut.percent),
      },
      inUpdateSwitchProps: [
        {
          switchInfo: relVarbInfoS.local(rentCut.switch),
          switchValue: "dollars",
          updateFnName: "simpleDivide",
          updateFnProps: {
            leftSide: relVarbInfoS.local(rentCutDollars.monthly),
            rightSide: relVarbInfoS.pibling(
              "propertyGeneral",
              "propertyGeneral",
              "targetRentMonthly",
              { expectedCount: "onlyOne" }
            ),
          },
        },
      ],
    }),
    [rentCut.percent]: relVarbS.percentObj("Rent cut", {
      initNumber: 5,
      inUpdateSwitchProps: [
        {
          switchInfo: relVarbInfoS.local(rentCut.switch),
          switchValue: "dollars",
          updateFnName: "decimalToPercent",
          updateFnProps: { num: relVarbInfoS.local(rentCut.decimal) },
        },
      ],
      displayNameEnd: " percent",
    }),
    // SectionsMeta is the highest level.
    [rentCutDollars.switch]: relVarb("string", {
      initValue: "monthly",
    }),
    [rentCutDollars.monthly]: relVarbS.moneyMonth("Rent cut", {
      initNumber: 0,
      displayNameEnd: " dollars monthly",
      inUpdateSwitchProps: [
        {
          switchInfo: relVarbInfoS.local(rentCut.switch),
          switchValue: "percent",
          updateFnName: "simpleMultiply",
          updateFnProps: {
            leftSide: relVarbInfoS.local(rentCut.decimal),
            rightSide: relVarbInfoS.pibling(
              "propertyGeneral",
              "propertyGeneral",
              "targetRentMonthly",
              { expectedCount: "onlyOne" }
            ),
          },
        },
        relUpdateSwitch.yearlyToMonthly("rentCutDollars"),
      ],
    }),
    [rentCutDollars.yearly]: relVarbS.moneyYear("Rent cut", {
      inUpdateSwitchProps: [
        {
          switchInfo: relVarbInfoS.local(rentCut.switch),
          switchValue: "percent",
          updateFnName: "simpleMultiply",
          updateFnProps: {
            leftSide: relVarbInfoS.local(rentCut.decimal),
            rightSide: relVarbInfoS.pibling(
              "propertyGeneral",
              "propertyGeneral",
              "targetRentYearly",
              { expectedCount: "onlyOne" }
            ),
          },
        },
        relUpdateSwitch.monthlyToYearly("rentCutDollars"),
      ],
      displayNameEnd: " dollars yearly",
    }),
    vacancyRatePercent: relVarbS.percentObj("Vacancy rate", {
      initNumber: 5,
      endAdornment: "%",
    }),
    vacancyRateDecimal: relVarbS.singlePropFn(
      "Vacancy rate decimal",
      "percentToDecimal",
      relVarbInfoS.local("vacancyRatePercent"),
      {
        initNumber: 0.05,
        unit: "decimal",
      }
    ),
    ...relVarbsS.decimalToPortion(
      "vacancyLossDollars",
      "Vacancy rent lost",
      (baseVarbName) => {
        return relVarbInfoS.pibling(
          "propertyGeneral",
          "propertyGeneral",
          baseVarbName,
          { expectedCount: "onlyOne" }
        );
      },
      "targetRent",
      "vacancyRateDecimal"
    ),
    upfrontExpenses: relVarbS.sumNums(
      "Upfront expenses",
      [relVarbInfoS.children("upfrontCostListGroup", "total")],
      { startAdornment: "$" }
    ),
    ...relVarbsS.ongoingSumNums(
      "expenses",
      "Ongoing expenses",
      [
        relVarbInfoS.children("ongoingCostListGroup", "total"),
        ...relVarbInfosS.local(["vacancyLossDollars", "rentCutDollars"]),
      ],
      {
        switchInit: "monthly",
        shared: { startAdornment: "$" },
      }
    ),
  };
}
