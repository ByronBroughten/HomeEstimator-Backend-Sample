import {
  baseCapExItem,
  baseOngoingItem,
} from "./allBaseSectionVarbs/baseOngoingItem";
import {
  BaseSectionVarbs,
  baseSectionVarbs,
  GeneralBaseSectionVarbs,
} from "./allBaseSectionVarbs/baseSectionVarbs";
import { baseOptions } from "./allBaseSectionVarbs/baseUnits";
import {
  baseVarb,
  baseVarbs,
  baseVarbsS,
} from "./allBaseSectionVarbs/baseVarbs";
import { SectionName, sectionNames } from "./SectionName";

const checkAllBaseSectionVarbs = <BSV extends GeneralAllBaseSectionVarbs>(
  bsv: BSV
) => bsv;

type GeneralAllBaseSectionVarbs = {
  [SN in SectionName]: GeneralBaseSectionVarbs;
};

type DefaultSectionsVarbs = {
  [SN in SectionName]: BaseSectionVarbs;
};

const varbs = baseSectionVarbs;
const defaults = sectionNames.reduce((defaults, sectionName) => {
  defaults[sectionName] = varbs();
  return defaults;
}, {} as DefaultSectionsVarbs);

const dollars = baseOptions.dollars;
const percent = baseOptions.percent;
const decimal = baseOptions.decimal;
const varbsS = baseVarbsS;
export function makeAllBaseSectionVarbs() {
  return checkAllBaseSectionVarbs({
    ...defaults,
    editorControls: varbs({
      editedDealDbId: baseVarb("string"),
    }),
    newDealMenu: varbs({ dealMode: baseVarb("dealMode") }),
    mainDealMenu: varbs({
      dealNameFilter: baseVarb("string"),
      dealModeFilter: baseVarb("dealMode"),
      dealSort: baseVarb("dealSort"),
      showArchived: baseVarb("boolean"),
    }),
    compareSection: varbs({
      dealNameFilter: baseVarb("string"),
      valueNameFilter: baseVarb("string"),
    }),
    compareOption: varbs({
      dbId: baseVarb("string"),
    }),
    compareValue: varbs({
      valueEntityInfo: baseVarb("inEntityValue"),
    }),
    variablesMenu: varbs({
      nameFilter: baseVarb("string"),
    }),
    proxyStoreItem: varbs({
      dbId: baseVarb("string"),
    }),
    compareTable: varbs({
      titleFilter: baseVarb("string"),
    } as const),
    tableRow: varbs({
      displayName: baseVarb("string"),
      compareToggle: baseVarb("boolean"),
    }),
    column: varbs({
      varbInfo: baseVarb("inEntityValue"),
    }),
    cell: varbs({
      columnFeId: baseVarb("string"),
      valueEntityInfo: baseVarb("inEntityValue"),
      displayVarb: baseVarb("string"),
    }),
    conditionalRow: varbs({
      level: baseVarb("number"),
      type: baseVarb("string"),
      // if
      left: baseVarb("numObj"),
      operator: baseVarb("string"),
      rightList: baseVarb("stringArray"),
      rightValue: baseVarb("numObj"),
      // then
      then: baseVarb("numObj"),
    }),
    sellingCostValue: varbs({
      valueSourceName: baseVarb("sellingCostSource"),
      valueDollars: baseVarb("numObj", dollars),
      valueDollarsEditor: baseVarb("numObj", dollars),
      valuePercent: baseVarb("numObj", percent),
      valuePercentEditor: baseVarb("numObj", percent),
      valueDecimal: baseVarb("numObj", decimal),
    }),
    singleTimeValue: varbs({
      ...varbsS.displayNameAndEditor,
      value: baseVarb("numObj", dollars),
      valueEditor: baseVarb("numObj"),
      valueSourceName: baseVarb("customValueSource"),
      isItemized: baseVarb("boolean"),
    }),
    onetimeList: varbs({
      ...varbsS.savableSection,
      total: baseVarb("numObj", dollars),
      itemValueSource: baseVarb("editorValueSource"),
    }),
    ongoingValue: varbs({
      ...varbsS.displayNameAndEditor,
      ...varbsS.ongoingDollarsInput("value"),
      valueSourceName: baseVarb("customValueSource"),
    }),
    ongoingList: varbs({
      ...baseVarbsS.savableSection,
      ...baseVarbsS.ongoingDollars("total"),
      itemValueSource: baseVarb("editorValueSource"),
      itemOngoingSwitch: baseVarb("ongoingSwitch"),
    }),
    capExList: varbs({
      ...baseVarbsS.savableSection,
      ...baseVarbsS.ongoingDollars("total"),
      itemOngoingSwitch: baseVarb("ongoingSwitch"),
    }),
    capExItem: baseCapExItem,
    ongoingItem: baseOngoingItem,
    numVarbList: varbs({
      ...baseVarbsS.savableSection,
      itemValueSource: baseVarb("editorValueSource"),
    }),
    boolVarbList: varbs({
      ...baseVarbsS.savableSection,
      itemValueSource: baseVarb("editorValueSource"),
    }),
    outputList: varbs({
      ...baseVarbsS.savableSection,
      itemValueSource: baseVarb("loadedVarbSource"),
    }),
    singleTimeItem: varbs({
      ...baseVarbsS.displayNameAndEditor,
      value: baseVarb("numObj"),
      valueEditor: baseVarb("numObj"),
      valueSourceName: baseVarb("editorValueSource"),
    }),
    outputItem: varbs({
      valueEntityInfo: baseVarb("inEntityValue"),
    }),
    virtualVarb: varbs({
      valueEntityInfo: baseVarb("inEntityValue"),
      value: baseVarb("numObj"),
      ...baseVarbs("stringObj", [
        "displayName",
        "startAdornment",
        "endAdornment",
      ] as const),
    }),
    customVarb: varbs(baseVarbsS.loadableVarb),
    boolVarbItem: varbs({
      ...baseVarbsS.displayNameAndEditor,
      value: baseVarb("boolean"),
      leftOperandi: baseVarb("numObj"),
      rightOperandi: baseVarb("numObj"),
      operator: baseVarb("string"),
    }),
    numVarbItem: varbs({
      value: baseVarb("numObj"),
      valueEditor: baseVarb("numObj"),
      valueSourceName: baseVarb("editorValueSource"),
      ...baseVarbsS.displayNameAndEditor,
      ...baseVarbsS.loadableVarb,
    }),
    conditionalRowList: varbs({
      value: baseVarb("numObj"),
    }),
    property: varbs({
      ...baseVarbsS.savableSection,
      propertyMode: baseVarb("dealMode"),
      completionStatus: baseVarb("completionStatus"),
      streetAddress: baseVarb("string"),
      city: baseVarb("string"),
      state: baseVarb("string"),
      zipCode: baseVarb("string"),
      one: baseVarb("number"),
      ...baseVarbs(
        "numObj",
        [
          "purchasePrice",
          "afterRepairValue",

          "sellingCosts",
          "miscOnetimeCosts",
          "rehabCostBase",
          "holdingCostTotal",

          "rehabCost",
          "upfrontExpenses",
        ] as const,
        dollars
      ),
      ...baseVarbs("numObj", [
        "sqft",
        "numBedrooms",
        "numBedroomsEditor",
        "numUnits",
        "numUnitsEditor",
      ] as const),

      ...baseVarbsS.ongoingDollarsInput("taxesHolding"),
      ...baseVarbsS.ongoingDollars("taxesOngoing"),

      ...baseVarbsS.ongoingDollarsInput("homeInsHolding"),
      ...baseVarbsS.ongoingDollars("homeInsOngoing"),

      ...baseVarbsS.monthsYearsInput("holdingPeriod"),

      ...baseVarbsS.ongoingDollars("utilitiesOngoing"),
      ...baseVarbsS.ongoingDollars("utilitiesHolding"),

      ...baseVarbsS.ongoingDollars("targetRent"),
      ...baseVarbsS.ongoingDollars("miscRevenue"),
      ...baseVarbsS.ongoingDollars("miscCosts"),
      ...baseVarbsS.ongoingDollars("holdingCost"),
      ...baseVarbsS.ongoingDollars("revenue"),
      ...baseVarbsS.ongoingDollars("expenses"),
    }),
    unit: varbs({
      one: baseVarb("number"),
      numBedrooms: baseVarb("numObj"),
      ...baseVarbsS.ongoingDollarsInput("targetRent"),
    }),
    miscOnetimeCost: varbs({
      valueSourceName: baseVarb("dollarsOrList"),
      valueDollarsEditor: baseVarb("numObj", dollars),
      valueDollars: baseVarb("numObj", dollars),
    }),
    miscOngoingCost: varbs({
      valueSourceName: baseVarb("dollarsOrListOngoing"),
      ...baseVarbsS.ongoingDollarsInput("valueDollars"),
    }),
    miscRevenueValue: varbs({
      valueSourceName: baseVarb("dollarsOrListOngoing"),
      ...baseVarbsS.ongoingDollarsInput("valueDollars"),
    }),
    miscHoldingCost: varbs({
      valueSourceName: baseVarb("dollarsOrListOngoing"),
      ...baseVarbsS.ongoingDollarsInput("valueDollars"),
    }),
    costOverrunValue: varbs({
      valueDollars: baseVarb("numObj", dollars),
      valuePercent: baseVarb("numObj", percent),
      valueDecimal: baseVarb("numObj", decimal),
      valueSourceName: baseVarb("overrunValueSource"),
      valueDollarsEditor: baseVarb("numObj", dollars),
      valuePercentEditor: baseVarb("numObj", percent),
    }),
    repairValue: varbs({
      valueDollars: baseVarb("numObj", dollars),
      valueSourceName: baseVarb("repairValueSource"),
      valueDollarsEditor: baseVarb("numObj", dollars),
    }),
    taxesOngoing: varbs({
      ...baseVarbsS.ongoingDollarsInput("valueDollars"),
      valueSourceName: baseVarb("ongoingPhaseSource"),
    }),
    homeInsOngoing: varbs({
      ...baseVarbsS.ongoingDollarsInput("valueDollars"),
      valueSourceName: baseVarb("ongoingPhaseSource"),
    }),
    utilityValue: varbs({
      ...baseVarbsS.ongoingDollars("valueDollars"),
      valueSourceName: baseVarb("utilityValueSource"),
    }),
    maintenanceValue: varbs({
      ...baseVarbsS.ongoingDollarsInput("valueDollars"),
      valueSourceName: baseVarb("maintainanceValueSource"),
    }),
    capExValue: varbs({
      ...baseVarbsS.ongoingDollarsInput("valueDollars"),
      valueSourceName: baseVarb("capExValueSource"),
    }),
    closingCostValue: varbs({
      value: baseVarb("numObj", dollars),
      valueSourceName: baseVarb("closingCostValueSource"),
      valueDollarsEditor: baseVarb("numObj", dollars),
    }),
    loan: varbs({
      ...baseVarbsS.savableSection,
      completionStatus: baseVarb("completionStatus"),
      loanPurpose: baseVarb("loanPurpose"),
      loanAmountInputMode: baseVarb("loanAmountInputMode"),
      loanPurchasedAssetValue: baseVarb("numObj", dollars),
      loanBaseDollars: baseVarb("numObj", dollars),

      ...varbsS.ongoingPercentInput("interestRatePercent"),
      ...baseVarbsS.ongoingDecimal("interestRateDecimal"),
      ...varbsS.monthsYearsInput("loanTerm"),

      isInterestOnly: baseVarb("boolean"),
      ...baseVarbsS.ongoingDollars("interestOnlySimple"),
      ...baseVarbsS.ongoingDollars("piFixedStandard"),
      ...baseVarbsS.ongoingDollars("loanPayment"),
      ...baseVarbsS.ongoingDollars("expenses"),

      piCalculationName: baseVarb("string"), // depreciated

      hasMortgageIns: baseVarb("boolean"),
      mortgageInsUpfront: baseVarb("numObj", dollars),
      mortgageInsUpfrontEditor: baseVarb("numObj", dollars),
      ...baseVarbsS.ongoingDollarsInput("mortgageIns"),
      ...baseVarbs(
        "numObj",
        [
          "loanTotalDollars",
          "closingCosts",
          "wrappedInLoan",
          "fivePercentBaseLoan",
        ] as const,
        dollars
      ),
    } as const),
    loanBaseValue: varbs({
      completionStatus: baseVarb("completionStatus"),
      valueSourceName: baseVarb("loanBaseValueSource"),
      valueDollars: baseVarb("numObj", dollars),
      valueDollarsEditor: baseVarb("numObj", dollars),
    }),
    purchaseLoanValue: baseVarbsS.loanValue,
    repairLoanValue: baseVarbsS.loanValue,
    arvLoanValue: baseVarbsS.loanValue,

    loanValue: baseVarbsS.loanValue,

    mgmt: varbs({
      ...baseVarbsS.savableSection,
      completionStatus: baseVarb("completionStatus"),
      ...baseVarbsS.ongoingDollars("basePayDollars"),
      ...baseVarbsS.ongoingDollars("vacancyLossDollars"),
      ...baseVarbsS.ongoingDollars("miscCosts"),
      miscOnetimeCosts: baseVarb("numObj", dollars),
      one: baseVarb("number"),
      basePayPercent: baseVarb("numObj", percent),
      vacancyLossPercent: baseVarb("numObj", percent),
      ...baseVarbsS.ongoingDollars("expenses"),
    } as const),
    mgmtBasePayValue: varbs({
      valueSourceName: baseVarb("mgmtBasePayValueSource"),
      ...baseVarbsS.ongoingDollarsInput("valueDollars"),
      valuePercentEditor: baseVarb("numObj", percent),
      valuePercent: baseVarb("numObj", percent),
      valueDecimal: baseVarb("numObj", decimal),
    }),
    vacancyLossValue: varbs({
      valueSourceName: baseVarb("vacancyLossValueSource"),
      ...baseVarbsS.ongoingDollarsInput("valueDollars"),
      valuePercentEditor: baseVarb("numObj", percent),
      valuePercent: baseVarb("numObj", percent),
      valueDecimal: baseVarb("numObj", decimal),
    }),
    outputSection: varbs({
      ...baseVarbsS.savableSection,
      showOutputs: baseVarb("boolean"),
    }),
    deal: varbs({
      dealMode: baseVarb("dealMode"),
      ...baseVarbsS.savableSection,
      ...baseVarbsS.displayNameEditor,
      completionStatus: baseVarb("completionStatus"),
      displayNameSource: baseVarb("dealDisplayNameSource"),
      ...baseVarbsS.ongoingDollars("ongoingPiti"),
      ...baseVarbsS.ongoingDollars("ongoingLoanPayment"),
      ...baseVarbsS.ongoingDollars("expenses"),
      ...baseVarbsS.ongoingDollars("cashFlow"),
      ...baseVarbsS.ongoingDecimal("cocRoiDecimal"),
      ...baseVarbsS.ongoingPercent("cocRoi"),
      totalInvestment: baseVarb("numObj", dollars),
      totalHoldingLoanPayment: baseVarb("numObj", dollars),
      preFinanceOneTimeExpenses: baseVarb("numObj", dollars),
      cashExpensesPlusLoanRepay: baseVarb("numObj", dollars),
      totalProfit: baseVarb("numObj", dollars),
      roiDecimal: baseVarb("numObj", decimal),
      roiPercent: baseVarb("numObj", percent),
      roiPercentPerMonth: baseVarb("numObj", percent),
      roiPercentAnnualized: baseVarb("numObj", percent),

      ...baseVarbsS.monthsYears("refiLoanHolding"),
      ...baseVarbsS.monthsYears("purchaseLoanHolding"),

      holdingRefiLoanPayment: baseVarb("numObj", dollars),
      holdingPurchaseLoanPayment: baseVarb("numObj", dollars),

      allClosingCosts: baseVarb("numObj", dollars),

      downPaymentDollars: baseVarb("numObj", dollars),
      downPaymentPercent: baseVarb("numObj", percent),
      downPaymentDecimal: baseVarb("numObj", decimal),
    }),
    financing: varbs({
      displayName: baseVarb("stringObj"),
      completionStatus: baseVarb("completionStatus"),
      financingMethod: baseVarb("financingMethod"),
      financingMode: baseVarb("financingMode"),
      downPaymentDollars: baseVarb("numObj", dollars),
      downPaymentPercent: baseVarb("numObj", percent),
      downPaymentDecimal: baseVarb("numObj", decimal),
      ...baseVarbsS.ongoingDollars("mortgageIns"),
      ...baseVarbsS.ongoingDollars("loanExpenses"),
      ...baseVarbsS.ongoingDollars("loanPayment"),
      ...baseVarbsS.monthsYearsInput("timeTillRefinance"),
      ...baseVarbs(
        "numObj",
        [
          "loanBaseDollars",
          "loanTotalDollars",
          "closingCosts",
          "mortgageInsUpfront",
          "loanUpfrontExpenses",
        ] as const,
        dollars
      ),
      one: baseVarb("number"),
    }),
    calculatedVarbs: varbs({
      ...baseVarbs(
        "numObj",
        ["pricePerUnit", "pricePerSqft", "arvPerSqft", "rehabPerSqft"] as const,
        dollars
      ),
      ...baseVarbs(
        "numObj",
        [
          "two",
          "twelve",
          "onePercentPrice",
          "twoPercentPrice",
          "fivePercentRentMonthly",
          "fivePercentRentYearly",
          "tenPercentRentMonthly",
          "tenPercentRentYearly",
          "onePercentPricePlusSqft",
          "onePercentPriceSqftAverage",
        ] as const,
        percent
      ),
      ...baseVarbs("boolean", ["propertyExists", "mgmtExists"] as const),
    }),
    feStore: varbs({
      changesToSave: baseVarb("changesToSave"),
      changesSaving: baseVarb("changesSaving"),

      timeOfFailedSave: baseVarb("number"),
      timeOfChangeIdle: baseVarb("number"),
      timeOfLastChange: baseVarb("number"),
      timeOfSave: baseVarb("number"),

      ...baseVarbs("string", ["email", "userName"] as const),
      authStatus: baseVarb("authStatus"),
      userDataStatus: baseVarb("userDataStatus"),
      userDataFetchTryCount: baseVarb("number"),
      labSubscription: baseVarb("labSubscription"),
      labSubscriptionExp: baseVarb("number"),
    }),
    userInfo: varbs({
      ...baseVarbs("string", ["email", "userName"] as const),
      timeJoined: baseVarb("dateTime"),
    }),
    stripeSubscription: varbs({
      subId: baseVarb("string"),
      status: baseVarb("string"),
      priceIds: baseVarb("stringArray"),
      currentPeriodEnd: baseVarb("dateTime"),
    }),
    authInfoPrivate: varbs({
      authId: baseVarb("string"),
    }),
    stripeInfoPrivate: varbs({
      customerId: baseVarb("string"),
    } as const),
    userInfoPrivate: varbs({
      ...baseVarbs("string", [
        "encryptedPassword",
        "emailAsSubmitted",
      ] as const),
      guestSectionsAreLoaded: baseVarb("boolean"),
    }),
  });
}

export type AllBaseSectionVarbs = typeof allBaseSectionVarbs;
export const allBaseSectionVarbs = makeAllBaseSectionVarbs();
