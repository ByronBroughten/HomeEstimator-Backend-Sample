import { omit } from "lodash";
import { z } from "zod";
import { Obj } from "../utils/Obj";
import {
  baseSection,
  baseSectionS,
  GeneralBaseSection,
} from "./baseSectionsUtils/baseSection";
import { baseVarbs, baseVarbsS } from "./baseSectionsUtils/baseVarbs";

export const savableSectionVarbNames = Obj.keys(baseVarbsS.savableSection);
export const loanVarbsNotInFinancing = [
  "interestRatePercentMonthly",
  "interestRatePercentYearly",
  "interestRateDecimalMonthly",
  "interestRateDecimalYearly",
  "piFixedStandardMonthly",
  "piFixedStandardYearly",
  "interestOnlySimpleMonthly",
  "interestOnlySimpleYearly",
  "loanTermMonths",
  "loanTermYears",
  "piCalculationName",
  ...savableSectionVarbNames,
] as const;

export type BaseSections = typeof baseSections;
export const baseSections = {
  root: baseSectionS.container,
  main: baseSection(),
  feUser: baseSection(),
  dbStore: baseSection(),
  proxy: baseSection(),
  // displayStoreProperty: baseSection(baseVarbsS.typeUniformity),
  // displayStoreLoan: baseSection(baseVarbsS.typeUniformity),
  // displayStoreMgmt: baseSection(baseVarbsS.typeUniformity),
  // displayStoreDeal: baseSection(baseVarbsS.typeUniformity),
  displayNameItem: baseSection({
    displayName: "string",
  }),
  displayNameList: baseSection({
    searchFilter: "string",
  }),
  omniParent: baseSectionS.container,
  compareTable: baseSection({ titleFilter: "string" } as const),
  tableRow: baseSection({
    displayName: "string",
    compareToggle: "boolean",
  }),
  column: baseSection({
    valueEntityInfo: "inEntityInfo",
  }),
  cell: baseSection({
    valueEntityInfo: "inEntityInfo",
    displayVarb: "string",
  }),
  conditionalRow: baseSection({
    level: "number",
    type: "string",
    // if
    left: "numObj",
    operator: "string",
    rightList: "stringArray",
    rightValue: "numObj",
    // then
    then: "numObj",
  }),
  singleTimeListGroup: baseSection({
    total: "numObj",
    defaultValueSwitch: "string",
  }),
  singleTimeList: baseSection({
    ...baseVarbsS.savableSection,
    total: "numObj",
    defaultValueSwitch: "string",
  }),
  ongoingListGroup: baseSection({
    ...baseVarbsS.ongoing("total"),
    defaultValueSwitch: "string",
    defaultOngoingSwitch: "string",
  }),
  ongoingList: baseSection({
    ...baseVarbsS.savableSection,
    ...baseVarbsS.ongoing("total"),
    defaultValueSwitch: "string",
    defaultOngoingSwitch: "string",
  }),
  userVarbList: baseSection({
    ...baseVarbsS.savableSection,
    defaultValueSwitch: "string",
  }),
  outputList: baseSection({
    ...baseVarbsS.savableSection,
    defaultValueSwitch: "string",
  }),
  singleTimeItem: baseSection({
    ...baseVarbsS.singleValueVirtualVarb,
    ...baseVarbsS.loadableVarb,
    ...baseVarbsS.switchableEquationEditor,
  }),
  ongoingItem: baseSection({
    ...baseVarbsS.virtualVarb,
    ...baseVarbsS.loadableVarb,
    ...baseVarbsS.switchableEquationEditor,
    ...baseVarbsS.ongoing("value"),
    ...baseVarbsS.switch("lifespan", "monthsYears"),
    costToReplace: "numObj",
  }),
  outputItem: baseSection({
    ...baseVarbsS.singleValueVirtualVarb,
    ...baseVarbsS.loadableVarb,
    ...baseVarbsS.switchableEquationEditor,
  }),
  customVarb: baseSection({
    ...baseVarbsS.singleValueVirtualVarb,
    ...baseVarbsS.loadableVarb,
  }),
  userVarbItem: baseSection({
    ...baseVarbsS.singleValueVirtualVarb,
    ...baseVarbsS.loadableVarb,
    ...baseVarbsS.switchableEquationEditor,
  }),
  conditionalRowList: baseSection({
    value: "numObj",
  }),

  login: baseSection(baseVarbs("string", ["email", "password"] as const)),
  register: baseSection(
    baseVarbs("string", ["email", "password", "userName"] as const)
  ),
  property: baseSection({
    ...baseVarbsS.savableSection,
    ...baseVarbs("numObj", [
      "price",
      "sqft",
      "numUnits",
      "numBedrooms",
      "upfrontExpenses",
      "upfrontRevenue",
      // "zipcode",
    ] as const),
    ...baseVarbsS.ongoing("taxes"),
    ...baseVarbsS.ongoing("homeIns"),
    ...baseVarbsS.ongoing("targetRent"),
    ...baseVarbsS.ongoing("expenses"),
    ...baseVarbsS.ongoing("miscRevenue"),
    ...baseVarbsS.ongoing("revenue"),
  }),
  unit: baseSection({
    one: "numObj",
    numBedrooms: "numObj",
    ...baseVarbsS.ongoing("targetRent"),
  }),
  get propertyGeneral() {
    return baseSection(
      omit(this.property.varbSchemas, savableSectionVarbNames)
    );
  },
  loan: baseSection({
    ...baseVarbsS.savableSection,
    ...baseVarbs("numObj", [
      "loanTotalDollars",
      "mortgageInsUpfront",
      "closingCosts",
      "wrappedInLoan",
    ] as const),
    ...baseVarbsS.ongoing("interestRateDecimal"),
    ...baseVarbsS.ongoing("piFixedStandard"),
    ...baseVarbsS.ongoing("interestOnlySimple"),
    ...baseVarbsS.ongoing("expenses"),
    ...baseVarbsS.ongoing("interestRatePercent"),
    ...baseVarbsS.switch("loanBase", "dollarsPercentDecimal"),
    ...baseVarbsS.switch("loanTerm", "monthsYears"),
    piCalculationName: "string",
    ...baseVarbsS.ongoing("loanPayment"),
    ...baseVarbsS.ongoing("mortgageIns"),
  } as const),
  get financing() {
    return baseSection({
      ...omit(this.loan.varbSchemas, loanVarbsNotInFinancing),
    });
  },
  mgmt: baseSection({
    ...baseVarbsS.savableSection,
    ...baseVarbs("numObj", [
      "vacancyRatePercent",
      "vacancyRateDecimal",
      "upfrontExpenses",
    ] as const),
    ...baseVarbsS.ongoing("expenses"),
    ...baseVarbsS.ongoing("vacancyLossDollars"),
    ...omit(baseVarbsS.switch("rentCut", "dollarsPercentDecimal"), [
      "rentCutDollars",
    ] as const),
    ...baseVarbsS.ongoing("rentCutDollars"),
  } as const),
  get mgmtGeneral() {
    return baseSection(omit(this.mgmt.varbSchemas, savableSectionVarbNames));
  },
  deal: baseSection({
    ...baseVarbsS.savableSection,
    ...baseVarbs("numObj", [
      "upfrontExpensesBaseSum",
      "upfrontExpenses",
      "upfrontRevenue",
      "totalInvestment",
      "downPaymentDollars",
      "downPaymentPercent",
      "downPaymentDecimal",
    ] as const),
    ...baseVarbsS.ongoing("piti"),
    ...baseVarbsS.ongoing("expenses"),
    ...baseVarbsS.ongoing("revenue"),
    ...baseVarbsS.ongoing("cashFlow"),
    ...baseVarbsS.ongoing("roiDecimal"),
    ...baseVarbsS.ongoing("roi"),
  }),
  stripeSubscription: baseSection({
    subId: "string",
    status: "string",
    priceIds: "stringArray",
    currentPeriodEnd: "number",
  }),
  subscriptionInfo: baseSection({
    plan: "string",
    planExp: "number",
  }),

  authInfo: baseSection({
    authStatus: "string",
  }),
  authInfoPrivate: baseSection({
    authId: "string",
  }),
  userInfo: baseSection({
    ...baseVarbs("string", ["email", "userName"] as const),
    timeJoined: "number",
  }),
  stripeInfoPrivate: baseSection({
    customerId: "string",
  } as const),
  userInfoPrivate: baseSection({
    ...baseVarbs("string", ["encryptedPassword", "emailAsSubmitted"] as const),
    guestSectionsAreLoaded: "boolean",
  }),
} as const;

export const simpleSectionNames = Obj.keys(baseSections);
export type SimpleSectionName = typeof simpleSectionNames[number];
export function isSectionName(value: any): value is SimpleSectionName {
  return simpleSectionNames.includes(value);
}
export const zSectionName = z
  .string()
  .refine((str) => isSectionName(str), "Not a valid sectionName");

export const allNull = simpleSectionNames.reduce((allNull, sectionName) => {
  allNull[sectionName] = null;
  return allNull;
}, {} as Record<SimpleSectionName, null>);

const userPlans = ["basicPlan", "fullPlan"] as const;
export type UserPlan = typeof userPlans[number];
export function isUserPlan(value: any): value is UserPlan {
  return userPlans.includes(value);
}

const authStatuses = ["guest", "user"] as const;
export type AuthStatus = typeof authStatuses[number];

type FeSectionName = keyof BaseSections;
export type BaseSectionsGeneral = Record<FeSectionName, GeneralBaseSection>;

const _testBaseSections = <T extends BaseSectionsGeneral>(_: T): void =>
  undefined;
_testBaseSections(baseSections);
