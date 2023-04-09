import {
  displayGroup,
  displayVarbsS,
  editorDisplayGroup,
} from "./allDisplaySectionVarbs/displayVarbs";
import { VarbName } from "./baseSectionsDerived/baseSectionsVarbsTypes";
import {
  displaySectionVarbs,
  DisplaySectionVarbs,
  displaySectionVarbsProp,
} from "./displaySectionVarbs/displaySectionVarbs";
import {
  DisplayName,
  DisplayVarb,
  displayVarbOptions,
} from "./displaySectionVarbs/displayVarb";
import { relVarbInfoS } from "./SectionInfo/RelVarbInfo";
import { SectionName, sectionNames } from "./SectionName";

type AllDisplaySectionVarbsGeneric = {
  [SN in SectionName]: DisplaySectionVarbs<SN>;
};

function allDefaultDisplaySectionVarbs(): AllDisplaySectionVarbsGeneric {
  return sectionNames.reduce((defaults, sectionName) => {
    (defaults as any)[sectionName] = displaySectionVarbs(sectionName);
    return defaults;
  }, {} as AllDisplaySectionVarbsGeneric);
}

const ongoingDollars = <BN extends string>(
  baseName: BN,
  displayName: DisplayName
) => displayVarbsS.ongoingDollars(baseName, displayName);
const ongoingInputDollars = <BN extends string>(
  baseName: BN,
  displayName: DisplayName
) => displayVarbsS.ongoingInputDollars(baseName, displayName);

const varb = displayVarbOptions;
const group = displayGroup;
export const allDisplaySectionVarbs = {
  ...allDefaultDisplaySectionVarbs(),
  ...displaySectionVarbsProp("property", {
    purchasePrice: varb("Purchase price"),
    sqft: varb("Square feet"),
    afterRepairValue: varb("ARV"),
    sellingCosts: varb("Selling costs"),
    numUnits: varb("Unit count"),
    numBedrooms: varb("Bedrooms"),
    upfrontExpenses: varb("Upfront expenses"),
    upfrontRevenue: varb("Upfront revenues"),
    ...editorDisplayGroup(
      "monthsYearsInput",
      "holdingPeriod",
      "Holding period"
    ),
    ...editorDisplayGroup("ongoingInput", "taxes", "Taxes", {
      monthly: { displayNameWithVariant: "Taxes monthly" },
      yearly: { displayNameWithVariant: "Taxes yearly" },
    }),
    ...editorDisplayGroup("ongoingInput", "homeIns", "Home insurance", {
      monthly: { displayNameWithVariant: "Home insurance monthly" },
      yearly: { displayNameWithVariant: "Home insurance yearly" },
    }),
    ...editorDisplayGroup("ongoingInput", "targetRent", "Rental income", {
      monthly: { displayNameWithVariant: "Rental income monthly" },
      yearly: { displayNameWithVariant: "Rental income yearly" },
    }),
    ...ongoingDollars("expenses", "Ongoing expenses"),
    ...ongoingDollars("miscRevenue", "Misc revenue"),
    ...ongoingDollars("revenue", "Revenue"),
  }),
  ...displaySectionVarbsProp("unit", {
    numBedrooms: varb("Bedrooms"),
    ...ongoingInputDollars("targetRent", "Rent"),
  }),
  ...displaySectionVarbsProp("calculatedVarbs", {
    ...group("ongoing", "loanPayment", "Loan payments", {
      monthly: { displayNameWithVariant: "Monthly loan payments" },
      yearly: { displayNameWithVariant: "Yearly loan payments" },
    }),
    downPaymentDollars: varb("Down payment"),
    ...group("ongoing", "loanExpenses", "Ongoing expenses", {
      monthly: { displayNameWithSection: "Ongoing loan expenses" },
      yearly: { displayNameWithSection: "Ongoing loan expenses" },
    }),
    loanUpfrontExpenses: varb("Upfront expenses", {
      displayNameWithSection: "Upfront loaneExpenses",
    }),
    loanTotalDollars: varb("Loan total"),
    onePercentPrice: varb("1% Purchase price"),
    twoPercentPrice: varb("2% Purchase price"),
    ...group("ongoing", "fivePercentRent", "5% Rent", {
      monthly: { displayNameWithVariant: "5% Rent monthly" },
      yearly: { displayNameWithVariant: "5% Rent yearly" },
    }),
  }),
  ...displaySectionVarbsProp("loanBaseValue", {
    valueDollars: varb("Base loan amount"),
    valueDollarsEditor: varb("Base loan amount"),
    valuePercent: varb("Base loan percent"),
    valuePercentEditor: varb("Base loan percent"),
  }),
  ...displaySectionVarbsProp("loan", {
    ...editorDisplayGroup("monthsYearsInput", "loanTerm", "Loan term"),
    ...editorDisplayGroup(
      "ongoingInput",
      "interestRatePercent",
      "Interest rate"
    ),
    ...group("ongoing", "interestRateDecimal", "Interest rate decimal"),
    ...group("ongoing", "piFixedStandard", "Principal and interest"),
    ...ongoingDollars("interestOnlySimple", "Interest"),
    ...ongoingDollars("expenses", "Expenses"),
    ...ongoingDollars("loanPayment", "Loan payment"),

    loanTotalDollars: varb("Total loan amount"),
    closingCosts: varb("Closing Costs"),
    wrappedInLoan: varb("Extras wrapped in loan"),

    mortgageInsUpfront: varb("Upfront mortgage insurance"),
    mortgageInsUpfrontEditor: varb("Upfront mortgage insurance"),
    ...editorDisplayGroup("ongoingInput", "mortgageIns", "Mortgage insurance"),
  }),
  ...displaySectionVarbsProp("mgmtBasePayValue", {
    valuePercentEditor: varb("Base pay percent of rent"),
    ...editorDisplayGroup("ongoingInput", "valueDollars", "Base pay"),
  }),
  ...displaySectionVarbsProp("vacancyLossValue", {
    valuePercentEditor: varb("Vacancy loss percent of rent"),
    ...editorDisplayGroup("ongoingInput", "valueDollars", "Vacancy loss"),
  }),
  ...displaySectionVarbsProp("mgmt", {
    ...group("ongoing", "basePayDollars", "Base pay", {
      targets: { displayNameWithSection: "Management base pay" },
      monthly: {
        displayNameWithVariant: "Base pay monthly",
        displayNameFullContext: "Management base pay monthly",
      },
      yearly: {
        displayNameWithVariant: "Base pay yearly",
        displayNameFullContext: "Management base pay yearly",
      },
    }),
    vacancyLossPercent: varb("Vacancy loss percent of rent"),
    upfrontExpenses: varb("Upfront expenses"),
    ...group("ongoing", "expenses", "Ongoing expenses", {
      targets: { displayNameWithSection: "Management expenses" },
      monthly: {
        displayNameWithVariant: "Expenses monthly",
        displayNameFullContext: "Monthly management expenses",
      },
      yearly: {
        displayNameWithVariant: "Expenses yearly",
        displayNameFullContext: "Yearly management expenses",
      },
    }),
  }),
  ...displaySectionVarbsProp("numVarbItem", {
    value: varb(relVarbInfoS.local("displayName")),
  }),
  ...displaySectionVarbsProp("deal", {
    upfrontExpenses: varb("Upfront expenses"),
    outOfPocketExpenses: varb("Out of pocket expenses"),
    upfrontRevenue: varb("Upfront revenue"),
    totalInvestment: varb("Total investment"),
    ...group("dollarsPercentDecimal", "downPayment", "Down payment", {
      dollars: { displayNameWithVariant: "Down payment" },
      percent: { displayNameWithVariant: "Down payment percent" },
      decimal: { displayNameWithVariant: "Down payment as decimal" },
    }),
    ...group("ongoing", "piti", "PITI payment", {
      monthly: { displayNameWithVariant: "Monthly PITI payment" },
      yearly: { displayNameWithVariant: "Yearly PITI payment" },
    }),
    ...group("ongoing", "cashFlow", "Cash flow", {
      monthly: { displayNameWithVariant: "Cash flow monthly" },
      yearly: { displayNameWithVariant: "Cash flow yearly" },
    }),
    ...group("ongoing", "cocRoi", "CoC ROI", {
      monthly: { displayNameWithVariant: "CoC ROI monthly" },
      yearly: { displayNameWithVariant: "CoC ROI yearly" },
    }),
    ...group("ongoing", "cocRoiDecimal", "CoC ROI as decimal", {
      monthly: { displayNameWithVariant: "Monthly CoC ROI as decimal" },
      yearly: { displayNameWithVariant: "Yearly CoC ROI as decimal" },
    }),
    ...group("ongoing", "expenses", "Expenses", {
      targets: { displayNameWithSection: "Deal expenses" },
      monthly: {
        displayNameWithVariant: "Expenses monthly",
        displayNameFullContext: "Monthly deal expenses",
      },
      yearly: {
        displayNameWithVariant: "Expenses yearly",
        displayNameFullContext: "Yearly deal expenses",
      },
    }),
    ...group("ongoing", "revenue", "Revenue", {
      targets: { displayNameWithSection: "Deal revenue" },
      monthly: {
        displayNameWithVariant: "Revenue monthly",
        displayNameFullContext: "Monthly deal revenue",
      },
      yearly: {
        displayNameWithVariant: "Revenue yearly",
        displayNameFullContext: "Yearly deal revenue",
      },
    }),
  }),
  ...displaySectionVarbsProp("singleTimeValueGroup", {
    total: varb("Total"),
  }),
  ...displaySectionVarbsProp("singleTimeValue", {
    value: varb(relVarbInfoS.local("displayName")),
    valueEditor: varb(relVarbInfoS.local("displayName")),
  }),
  ...displaySectionVarbsProp("singleTimeList", {
    total: varb(relVarbInfoS.local("displayName")),
  }),
  ...displaySectionVarbsProp("ongoingValueGroup", {
    ...group("ongoing", "total", relVarbInfoS.local("displayName")),
  }),
  ...displaySectionVarbsProp(
    "ongoingValue",
    editorDisplayGroup(
      "ongoingInput",
      "value",
      relVarbInfoS.local("displayName")
    )
  ),
  ...displaySectionVarbsProp("ongoingList", {
    ...group("ongoing", "total", relVarbInfoS.local("displayName")),
  }),
  ...displaySectionVarbsProp("singleTimeItem", {
    value: varb(relVarbInfoS.local("displayName")),
    valueEditor: varb(relVarbInfoS.local("displayName")),
  }),
  ...displaySectionVarbsProp(
    "ongoingItem",
    editorDisplayGroup(
      "ongoingInput",
      "value",
      relVarbInfoS.local("displayName")
    )
  ),
};

export function getDisplayVarb<SN extends SectionName, VN extends VarbName<SN>>(
  sectionName: SN,
  varbName: VN
): DisplayVarb {
  const sectionVarbs = allDisplaySectionVarbs[sectionName];
  return (sectionVarbs as any)[varbName] as DisplayVarb;
}

export function fullDisplayNameString<
  SN extends SectionName,
  VN extends VarbName<SN>
>(sectionName: SN, varbName: VN): string {
  const { displayNameFullContext } = getDisplayVarb(sectionName, varbName);

  if (typeof displayNameFullContext === "string") {
    return displayNameFullContext;
  } else {
    throw new Error(
      "Varbs that can be used here should have a string displayName"
    );
  }
}
