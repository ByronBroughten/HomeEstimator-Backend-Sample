import { fixedVariableLabel } from "../../../../varbLabels";
import { ValidationError } from "../../utils/Error";
import { Obj } from "../../utils/Obj";
import { targetNames } from "../allBaseSectionVarbs/baseSwitchNames";
import { VarbName } from "../baseSectionsDerived/baseSectionsVarbsTypes";
import {
  pathSectionName,
  PathSectionName,
  SectionPathName,
  SectionPathVarbName,
} from "../sectionPathContexts/sectionPathNames";
import { VarbValue } from "../values/StateValue";
import { DbIdProp } from "./NanoIdInfo";
import { MixedInfoProps } from "./VarbInfoBase";

type MakeVarbPathParams<
  PN extends SectionPathName,
  VN extends SectionPathVarbName<PN>
> = {
  pathName: PN;
  varbName: VN;
  collectionName: string;
};

const allVarbPathParams = {
  ...sectionVarbNameParams("calculatedVarbsFocal", "Property", [
    "propertyAge",
    "currentYear",
    "two",
    "twelve",
    "onePercentPrice",
    "twoPercentPrice",
    "onePercentArv",
    "twoPercentArv",
    "onePercentArvPlusSqft",
    "onePercentArvSqftAverage",
    "onePercentPricePlusSqft",
    "onePercentPriceSqftAverage",
    "threeHundredPerUnit",
    "threeHundredPerUnitTimesTwelve",
    ...targetNames("fivePercentRent", "periodic"),
    ...targetNames("tenPercentRent", "periodic"),
  ]),
  ...sectionVarbNameParams("propertyFocal", "Property", [
    "likability",
    "yearBuilt",
    "sellingCosts",
    "holdingPeriodMonths",
    "holdingPeriodYears",
    "purchasePrice",
    "afterRepairValue",
    "sqft",
    "numBedrooms",
    "numUnits",
    ...targetNames("utilitiesHolding", "periodic"),
    ...targetNames("utilitiesOngoing", "periodic"),
    ...targetNames("taxesHolding", "periodic"),
    ...targetNames("homeInsHolding", "periodic"),
    ...targetNames("taxesOngoing", "periodic"),
    ...targetNames("homeInsOngoing", "periodic"),
    ...targetNames("utilitiesOngoing", "periodic"),
    // ...targetNames("utilitiesHolding", "periodic"),

    ...targetNames("targetRent", "periodic"),
  ]),
  ...sectionVarbNameParams("mgmtFocal", "Management", [
    "vacancyLossPercent",
    ...targetNames("basePayDollars", "periodic"),
  ]),
  managementExpensesMonthly: fixedVarbPathParams(
    "Management",
    "mgmtFocal",
    "expensesMonthly"
  ),
  managementExpensesYearly: fixedVarbPathParams(
    "Management",
    "mgmtFocal",
    "expensesYearly"
  ),
  ...sectionVarbNameParams("dealFocal", "Financing", [
    ...targetNames("ongoingPiti", "periodic"),
    ...targetNames("ongoingLoanPayment", "periodic"),
  ]),
  ...sectionVarbNameParams("dealFocal", "Deal", [
    "totalInvestment",
    ...targetNames("cashFlow", "periodic"),
    ...targetNames("cocRoi", "periodic"),
    ...targetNames("averageNonPrincipalOngoing", "periodic"),
    ...targetNames("netNonPrincipalOngoing", "periodic"),
  ]),
  propertyExpensesOngoingMonthly: fixedVarbPathParams(
    "Property",
    "propertyFocal",
    "expensesOngoingMonthly"
  ),
  propertyExpensesOngoingYearly: fixedVarbPathParams(
    "Property",
    "propertyFocal",
    "expensesOngoingYearly"
  ),
  dealMode: fixedVarbPathParams("Deal", "dealFocal", "dealMode"),
  dealNetExpensesOngoingMonthly: fixedVarbPathParams(
    "Deal",
    "dealFocal",
    "netExpensesOngoingMonthly"
  ),
  dealNetExpensesOngoingYearly: fixedVarbPathParams(
    "Deal",
    "dealFocal",
    "netExpensesOngoingYearly"
  ),
  dealExpensesOngoingMonthly: fixedVarbPathParams(
    "Deal",
    "dealFocal",
    "expensesOngoingMonthly"
  ),
  dealExpensesOngoingYearly: fixedVarbPathParams(
    "Deal",
    "dealFocal",
    "expensesOngoingYearly"
  ),
  propertyRevenueOngoingMonthly: fixedVarbPathParams(
    "Property",
    "propertyFocal",
    "revenueOngoingMonthly"
  ),
  propertyRevenueOngoingYearly: fixedVarbPathParams(
    "Property",
    "propertyFocal",
    "revenueOngoingYearly"
  ),
  userVarbValue: varbPathParams("numVarbItemMain", "value"),
  rehabCostBase: fixedVarbPathParams(
    "Property",
    "propertyFocal",
    "rehabCostBase"
  ),
  rehabCost: fixedVarbPathParams("Property", "propertyFocal", "rehabCost"),

  valueAddProfit: fixedVarbPathParams("Deal", "dealFocal", "valueAddProfit"),
  valueAddRoiPercent: fixedVarbPathParams(
    "Deal",
    "dealFocal",
    "valueAddRoiPercent"
  ),
  valueAddRoiPercentAnnualized: fixedVarbPathParams(
    "Deal",
    "dealFocal",
    "valueAddRoiPercentAnnualized"
  ),

  vaProfitOnSale: fixedVarbPathParams("Deal", "dealFocal", "vaProfitOnSale"),
  vaRoiOnSalePercent: fixedVarbPathParams(
    "Deal",
    "dealFocal",
    "vaRoiOnSalePercent"
  ),
  vaRoiOnSalePercentAnnualized: fixedVarbPathParams(
    "Deal",
    "dealFocal",
    "vaRoiOnSalePercentAnnualized"
  ),
};

export const varbPathNames = Obj.keys(allVarbPathParams);
export function isVarbPathName(value: any): value is VarbPathName {
  return varbPathNames.includes(value);
}
export function validateVarbPathName(value: any): VarbPathName {
  if (isVarbPathName(value)) {
    return value;
  } else {
    throw new ValidationError(`value "${value}" is not a varbPathName`);
  }
}

type AllVarbPathParams = typeof allVarbPathParams;
export type VarbPathName = keyof AllVarbPathParams;

export type VarbSectionPathName<VPN extends VarbPathName = VarbPathName> =
  AllVarbPathParams[VPN]["pathName"];
export function varbSectionPathName<VPN extends VarbPathName>(
  varbPathName: VPN
): VarbSectionPathName<VPN> {
  return allVarbPathParams[varbPathName]["pathName"];
}

export type VarbPathParams<VPN extends VarbPathName> = AllVarbPathParams[VPN];

type VarbPathSectionName<VPN extends VarbPathName> = PathSectionName<
  VarbPathParams<VPN>["pathName"]
>;

export type VarbPathValue<VPN extends VarbPathName> = VarbValue<
  VarbPathSectionName<VPN>,
  VarbPathParams<VPN>["varbName"] & VarbName<VarbPathSectionName<VPN>>
>;

export function getVarbPathParams<VPN extends VarbPathName>(
  varbPathName: VPN
): AllVarbPathParams[VPN] {
  return allVarbPathParams[varbPathName];
}

type VarbPathExtras<VPN extends VarbPathName> = AllVarbPathParams[VPN] & {
  displayName: string;
  varbInfo: VarbPathNameInfoMixed<VPN>;
  sectionName: VarbPathSectionName<VPN>;
};
export function getVarbPathExtras<VPN extends VarbPathName>(
  varbPathName: VPN
): VarbPathExtras<VPN> {
  const params = getVarbPathParams(varbPathName);
  const { pathName, varbName } = params;
  const sectionName = pathSectionName(pathName) as VarbPathSectionName<VPN>;
  return {
    ...params,
    sectionName,
    displayName: fixedVariableLabel(sectionName, varbName as any),
    varbInfo: varbPathInfo(varbPathName),
  } as VarbPathExtras<VPN>;
}

export interface VarbPathNameProp<VPN extends VarbPathName = VarbPathName> {
  varbPathName: VPN;
}

export interface VarbPathNameInfoMixed<VPN extends VarbPathName = VarbPathName>
  extends VarbPathNameProp<VPN>,
    MixedInfoProps<"varbPathName"> {}
export interface VarbPathNameDbInfoMixed<
  VPN extends VarbPathName = VarbPathName
> extends VarbPathNameProp<VPN>,
    MixedInfoProps<"varbPathDbId">,
    DbIdProp {}

type SectionVarbPathParams<
  PN extends SectionPathName,
  VN extends SectionPathVarbName<PN>
> = {
  [V in VN]: MakeVarbPathParams<PN, V>;
};

export const collectionNamesFixed = [
  "Property",
  "Deal",
  "Financing",
  "Management",
] as const;
type CollectionNameFixed = (typeof collectionNamesFixed)[number];

function varbPathParams<
  PN extends SectionPathName,
  VN extends SectionPathVarbName<PN>
>(pathName: PN, varbName: VN) {
  return {
    collectionName: "Custom",
    pathName,
    varbName,
  };
}

function fixedVarbPathParams<
  PN extends SectionPathName,
  VN extends SectionPathVarbName<PN>
>(
  collectionName: CollectionNameFixed,
  pathName: PN,
  varbName: VN
): MakeVarbPathParams<PN, VN> {
  return {
    collectionName,
    pathName,
    varbName,
  };
}

function sectionVarbNameParams<
  PN extends SectionPathName,
  VN extends SectionPathVarbName<PN>
>(
  pathName: PN,
  collectionName: CollectionNameFixed,
  varbNames: VN[]
): SectionVarbPathParams<PN, VN> {
  return varbNames.reduce((options, varbName) => {
    options[varbName] = fixedVarbPathParams(collectionName, pathName, varbName);
    return options;
  }, {} as SectionVarbPathParams<PN, VN>);
}

export function varbPathInfo<VPN extends VarbPathName>(
  varbPathName: VPN
): VarbPathNameInfoMixed<VPN> {
  return {
    infoType: "varbPathName",
    varbPathName,
  };
}

export function varbPathDbIdInfo<VPN extends VarbPathName>(
  varbPathName: VPN,
  dbId: string
): VarbPathNameDbInfoMixed<VPN> {
  return {
    infoType: "varbPathDbId",
    varbPathName,
    dbId,
  };
}

type VarbPathArrParam<VPN extends VarbPathName = VarbPathName> =
  VarbPathParams<VPN> & {
    varbPathName: VPN;
  };
export const varbPathParamArr: VarbPathArrParam[] = varbPathNames.map(
  (varbPathName) => ({
    varbPathName,
    ...getVarbPathParams(varbPathName),
  })
);
