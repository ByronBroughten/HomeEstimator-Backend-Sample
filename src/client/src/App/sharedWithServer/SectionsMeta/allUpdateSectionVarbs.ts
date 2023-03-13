import { timeS } from "../utils/date";
import { dealRelVarbs } from "./allUpdateSectionVarbs/dealUpdateVarbs";
import { downPaymentUpdateVarbs } from "./allUpdateSectionVarbs/downPaymentUpdateVarbs";
import { financingUpdateVarbs } from "./allUpdateSectionVarbs/financingUpdateVarbs";
import { loanBaseUpdateVarbs } from "./allUpdateSectionVarbs/loanBaseUpdateVarbs";
import { loanUpdateVarbs } from "./allUpdateSectionVarbs/loanUpdateVarbs";
import { mgmtBasePayValueVarbs } from "./allUpdateSectionVarbs/mgmtBasePayUpdateVarbs";
import { mgmtRelVarbs } from "./allUpdateSectionVarbs/mgmtUpdateVarbs";
import {
  capExItemUpdateVarbs,
  ongoingItemUpdateVarbs,
} from "./allUpdateSectionVarbs/ongoingItemUpdateVarbs";
import { propertyUpdateVarbs } from "./allUpdateSectionVarbs/propertyUpdateVarbs";
import { vacancyLossUpdateVarbs } from "./allUpdateSectionVarbs/vacancyLossUpdateVarbs";
import { VarbName } from "./baseSectionsDerived/baseSectionsVarbsTypes";

import { mixedInfoS } from "./SectionInfo/MixedSectionInfo";
import { relVarbInfoS } from "./SectionInfo/RelVarbInfo";
import { SectionName, sectionNames } from "./SectionName";
import {
  defaultSectionUpdateVarbs,
  updateSectionProp,
  UpdateSectionVarbs,
} from "./updateSectionVarbs/updateSectionVarbs";
import { updateVarb, updateVarbS } from "./updateSectionVarbs/updateVarb";
import {
  updateBasics,
  UpdateBasics,
  updateBasicsS,
} from "./updateSectionVarbs/updateVarb/UpdateBasics";
import {
  completionStatusProps,
  updateFnPropS,
  updateFnPropsS,
} from "./updateSectionVarbs/updateVarb/UpdateFnProps";
import {
  overrideSwitch,
  overrideSwitchS,
  updateOverride,
  updateOverrideS,
} from "./updateSectionVarbs/updateVarb/UpdateOverrides";
import { updateVarbsS } from "./updateSectionVarbs/updateVarbs";
import { numObj } from "./values/StateValue/NumObj";

type GenericAllUpdateSections = {
  [SN in SectionName]: UpdateSectionVarbs<SN>;
};

function checkAllUpdateSections<US extends GenericAllUpdateSections>(
  allUpdateSections: US
): US {
  return allUpdateSections;
}

type DefaultRelSectionsVarbs = {
  [SN in SectionName]: UpdateSectionVarbs<SN>;
};

function makeAllDefaultUpdateSections() {
  return sectionNames.reduce((defaultUpdateSections, sectionName) => {
    defaultUpdateSections[sectionName] = defaultSectionUpdateVarbs(
      sectionName
    ) as any;
    return defaultUpdateSections;
  }, {} as DefaultRelSectionsVarbs);
}

function makeAllUpdateSections() {
  return checkAllUpdateSections({
    ...makeAllDefaultUpdateSections(),
    ...updateSectionProp("loan", loanUpdateVarbs()),
    ...updateSectionProp("loanBaseValue", loanBaseUpdateVarbs()),
    ...updateSectionProp("downPaymentValue", downPaymentUpdateVarbs()),
    ...updateSectionProp("mgmt", mgmtRelVarbs()),
    ...updateSectionProp("vacancyLossValue", vacancyLossUpdateVarbs()),
    ...updateSectionProp("mgmtBasePayValue", mgmtBasePayValueVarbs()),
    ...updateSectionProp("deal", dealRelVarbs()),
    ...updateSectionProp("financing", financingUpdateVarbs()),
    ...updateSectionProp("property", propertyUpdateVarbs()),
    ...updateSectionProp("unit", {
      one: updateVarbS.one(),
      numBedrooms: updateVarb("numObj"),
      ...updateVarbsS.ongoingInputNext("targetRent"),
    }),
    ...updateSectionProp("utilityValue", {
      valueSourceName: updateVarb("utilityValueSource", { initValue: "none" }),
      ...updateVarbsS.group("value", "ongoing", "monthly", {
        targets: { updateFnName: "throwIfReached" },
        monthly: {
          updateOverrides: [
            updateOverride(
              [overrideSwitchS.local("valueSourceName", "none")],
              updateBasics("emptyNumObj")
            ),
            updateOverride(
              [overrideSwitchS.local("valueSourceName", "zero")],
              updateBasics("solvableTextZero")
            ),
            updateOverride(
              [overrideSwitchS.local("valueSourceName", "listTotal")],
              updateBasicsS.loadFromChild("ongoingList", "totalMonthly")
            ),
          ],
        },
        yearly: {
          updateOverrides: [
            updateOverride(
              [overrideSwitchS.local("valueSourceName", "none")],
              updateBasics("emptyNumObj")
            ),
            updateOverride(
              [overrideSwitchS.local("valueSourceName", "zero")],
              updateBasics("solvableTextZero")
            ),
            updateOverride(
              [overrideSwitchS.local("valueSourceName", "listTotal")],
              updateBasicsS.loadFromChild("ongoingList", "totalYearly")
            ),
          ],
        },
      }),
    }),
    ...updateSectionProp("capExValue", {
      valueSourceName: updateVarb("capExValueSource", { initValue: "none" }),
      ...updateVarbsS.group("value", "ongoing", "monthly", {
        targets: { updateFnName: "throwIfReached" },
        monthly: {
          updateOverrides: [
            updateOverride(
              [overrideSwitchS.local("valueSourceName", "none")],
              updateBasics("emptyNumObj")
            ),
            updateOverride(
              [overrideSwitchS.local("valueSourceName", "fivePercentRent")],
              updateBasicsS.loadByVarbPathName("fivePercentRentMonthly")
            ),
            updateOverride(
              [overrideSwitchS.local("valueSourceName", "listTotal")],
              updateBasicsS.loadFromChild("capExList", "totalMonthly")
            ),
            updateOverride(
              [
                overrideSwitchS.local("valueSourceName", "valueEditor"),
                overrideSwitchS.switchIsActive("value", "ongoing", "monthly"),
              ],
              updateBasicsS.loadFromLocal("valueDollarsEditor")
            ),
            updateOverride(
              [
                overrideSwitchS.local("valueSourceName", "valueEditor"),
                overrideSwitchS.switchIsActive("value", "ongoing", "yearly"),
              ],
              updateBasicsS.yearlyToMonthly("value")
            ),
          ],
        },
        yearly: {
          updateOverrides: [
            updateOverride(
              [overrideSwitchS.local("valueSourceName", "none")],
              updateBasics("emptyNumObj")
            ),
            updateOverride(
              [overrideSwitchS.local("valueSourceName", "fivePercentRent")],
              updateBasicsS.loadByVarbPathName("fivePercentRentYearly")
            ),
            updateOverride(
              [overrideSwitchS.local("valueSourceName", "listTotal")],
              updateBasicsS.loadFromChild("capExList", "totalYearly")
            ),
            updateOverride(
              [
                overrideSwitchS.local("valueSourceName", "valueEditor"),
                overrideSwitchS.switchIsActive("value", "ongoing", "yearly"),
              ],
              updateBasicsS.loadFromLocal("valueDollarsEditor")
            ),
            updateOverride(
              [
                overrideSwitchS.local("valueSourceName", "valueEditor"),
                overrideSwitchS.switchIsActive("value", "ongoing", "monthly"),
              ],
              updateBasicsS.monthlyToYearly("value")
            ),
          ],
        },
      }),
    }),
    ...updateSectionProp("capExList", {
      ...updateVarbsS.savableSection,
      ...updateVarbsS.group("total", "ongoing", "monthly", {
        monthly: updateBasicsS.sumChildren("capExItem", "valueMonthly"),
        yearly: updateBasicsS.sumChildren("capExItem", "valueYearly"),
      }),
      itemOngoingSwitch: updateVarb("string", { initValue: "monthly" }),
    }),
    ...updateSectionProp("capExItem", capExItemUpdateVarbs()),
    ...updateSectionProp("maintenanceValue", {
      valueSourceName: updateVarb("maintainanceValueSource", {
        initValue: "none",
      }),
      ...updateVarbsS.group("value", "ongoing", "monthly", {
        targets: { updateFnName: "throwIfReached" },
        monthly: {
          updateOverrides: [
            updateOverride(
              [overrideSwitchS.local("valueSourceName", "none")],
              updateBasics("emptyNumObj")
            ),
            updateOverride(
              [
                overrideSwitchS.local("valueSourceName", "valueEditor"),
                overrideSwitchS.switchIsActive("value", "ongoing", "monthly"),
              ],
              updateBasicsS.loadFromLocal("valueDollarsEditor")
            ),
            updateOverride(
              [
                overrideSwitchS.local("valueSourceName", "valueEditor"),
                overrideSwitchS.yearlyIsActive("value"),
              ],
              updateBasicsS.yearlyToMonthly("value")
            ),
            updateOverride(
              [
                overrideSwitchS.local(
                  "valueSourceName",
                  ...["onePercentPrice", "sqft", "onePercentAndSqft"]
                ),
              ],
              updateBasicsS.yearlyToMonthly("value")
            ),
          ],
        },
        yearly: {
          updateOverrides: [
            updateOverride(
              [overrideSwitchS.local("valueSourceName", "none")],
              updateBasics("emptyNumObj")
            ),
            updateOverride(
              [
                overrideSwitchS.local("valueSourceName", "valueEditor"),
                overrideSwitchS.yearlyIsActive("value"),
              ],
              updateBasicsS.loadFromLocal("valueDollarsEditor")
            ),
            updateOverride(
              [
                overrideSwitchS.local("valueSourceName", "valueEditor"),
                overrideSwitchS.monthlyIsActive("value"),
              ],
              updateBasicsS.monthlyToYearly("value")
            ),
            updateOverride(
              [overrideSwitchS.local("valueSourceName", "onePercentPrice")],
              updateBasicsS.loadByVarbPathName("onePercentPrice")
            ),
            updateOverride(
              [overrideSwitchS.local("valueSourceName", "sqft")],
              updateBasicsS.loadByVarbPathName("sqft")
            ),
            updateOverride(
              [overrideSwitchS.local("valueSourceName", "onePercentAndSqft")],
              updateBasicsS.loadByVarbPathName("onePercentPriceSqftAverage")
            ),
          ],
        },
      }),
    }),
    ...updateSectionProp("repairValue", {
      valueSourceName: updateVarb("repairValueSource", { initValue: "none" }),
      value: updateVarb("numObj", {
        updateFnName: "throwIfReached",
        updateOverrides: [
          updateOverride(
            [overrideSwitchS.local("valueSourceName", "none")],
            updateBasics("emptyNumObj")
          ),
          updateOverride(
            [overrideSwitchS.local("valueSourceName", "zero")],
            updateBasicsS.zero
          ),
          updateOverride(
            [overrideSwitchS.local("valueSourceName", "valueEditor")],
            updateBasicsS.loadFromLocal("valueDollarsEditor")
          ),
          updateOverride(
            [overrideSwitchS.local("valueSourceName", "listTotal")],
            updateBasicsS.loadFromChild("singleTimeList", "total")
          ),
        ],
      }),
    }),
    ...updateSectionProp("feUser", {
      authStatus: updateVarb("authStatus", { initValue: "guest" }),
      labSubscription: updateVarb("labSubscription", {
        initValue: "basicPlan",
      }),
      labSubscriptionExp: updateVarb("number", {
        initValue: timeS.hundredsOfYearsFromNow,
      }),
      userDataStatus: updateVarb("userDataStatus", {
        initValue: "notLoaded",
      }),
    }),
    ...updateSectionProp("userInfoPrivate", {
      guestSectionsAreLoaded: updateVarb("boolean", { initValue: false }),
    }),
    ...updateSectionProp("outputList", {
      itemValueSource: updateVarb("loadedVarbSource", {
        initValue: "loadedVarb",
      } as const),
    }),
    ...updateSectionProp("singleTimeValueGroup", {
      total: updateVarbS.sumNums([
        updateFnPropS.children("singleTimeValue", "value"),
      ]),
      itemValueSource: updateVarb("string", {
        initValue: "valueEditor",
      }),
    }),
    ...updateSectionProp("singleTimeList", {
      total: updateVarbS.sumNums([
        updateFnPropS.children("singleTimeItem", "value"),
      ]),
      itemValueSource: updateVarb("editorValueSource", {
        initValue: "valueEditor",
      }),
    }),
    ...updateSectionProp("closingCostValue", {
      valueSourceName: updateVarb("closingCostValueSource", {
        initValue: "none",
      }),
      valueDollarsEditor: updateVarb("numObj"),
      value: updateVarb("numObj", {
        updateFnName: "throwIfReached",
        updateOverrides: [
          updateOverride(
            [overrideSwitchS.valueSourceIs("none")],
            updateBasics("emptyNumObj")
          ),
          updateOverride(
            [overrideSwitchS.valueSourceIs("fivePercentLoan")],
            updateBasics("emptyNumObj")
          ),
          updateOverride(
            [overrideSwitchS.valueSourceIs("listTotal")],
            updateBasicsS.loadFromChild("singleTimeList", "total")
          ),
          updateOverride(
            [overrideSwitchS.valueSourceIs("valueEditor")],
            updateBasicsS.loadSolvableTextByVarbInfo("valueDollarsEditor")
          ),
        ],
      }),
    }),
    ...updateSectionProp("singleTimeValue", {
      ...updateVarbsS.displayNameAndEditor,
      value: updateVarb("numObj", {
        updateFnName: "throwIfReached",
        updateOverrides: [
          updateOverride(
            [overrideSwitchS.valueSourceIs("none")],
            updateBasics("emptyNumObj")
          ),
          updateOverride(
            [overrideSwitchS.valueSourceIs("listTotal")],
            updateBasicsS.loadFromChild(
              "singleTimeList",
              "total"
            ) as UpdateBasics<"numObj">
          ),
          updateOverride(
            [overrideSwitchS.valueSourceIs("valueEditor")],
            updateBasicsS.loadSolvableTextByVarbInfo(
              "valueEditor"
            ) as UpdateBasics<"numObj">
          ),
        ],
      }),
      valueEditor: updateVarb("numObj"),
      valueSourceName: updateVarb("customValueSource", {
        initValue: "valueEditor",
      }),
    }),
    ...updateSectionProp("ongoingValue", {
      ...updateVarbsS.displayNameAndEditor,
      valueSourceName: updateVarb("customValueSource", {
        initValue: "valueEditor",
      }),
      ...updateVarbsS.ongoingInputNext("value", {
        monthly: {
          updateFnName: "throwIfReached",
          updateOverrides: [
            updateOverride(
              [overrideSwitchS.valueSourceIs("none")],
              updateBasics("emptyNumObj")
            ),
            updateOverride(
              [overrideSwitchS.valueSourceIs("listTotal")],
              updateBasicsS.loadFromChild(
                "ongoingList",
                "totalMonthly"
              ) as UpdateBasics<"numObj">
            ),
            updateOverride(
              [
                overrideSwitchS.valueSourceIs("valueEditor"),
                overrideSwitchS.monthlyIsActive("value"),
              ],
              updateBasicsS.loadFromLocal("valueOngoingEditor")
            ),
            updateOverride(
              [
                overrideSwitchS.valueSourceIs("valueEditor"),
                overrideSwitchS.yearlyIsActive("value"),
              ],
              updateBasicsS.yearlyToMonthly("value")
            ),
          ],
        },
        yearly: {
          updateFnName: "throwIfReached",
          updateOverrides: [
            updateOverride(
              [overrideSwitchS.valueSourceIs("none")],
              updateBasics("emptyNumObj")
            ),
            updateOverride(
              [overrideSwitchS.valueSourceIs("listTotal")],
              updateBasicsS.loadFromChild(
                "ongoingList",
                "totalYearly"
              ) as UpdateBasics<"numObj">
            ),
            updateOverride(
              [
                overrideSwitchS.valueSourceIs("valueEditor"),
                overrideSwitchS.yearlyIsActive("value"),
              ],
              updateBasicsS.loadFromLocal("valueOngoingEditor")
            ),
            updateOverride(
              [
                overrideSwitchS.valueSourceIs("valueEditor"),
                overrideSwitchS.monthlyIsActive("value"),
              ],
              updateBasicsS.monthlyToYearly("value")
            ),
          ],
        },
        editor: { updateFnName: "calcVarbs" },
      }),
    }),
    ...updateSectionProp("dealPage", {
      showOutputs: updateVarb("boolean", {
        initValue: false,
      }),
    }),
    ...updateSectionProp("ongoingValueGroup", {
      ...updateVarbsS.ongoingSumNums(
        "total",
        [updateFnPropS.children("ongoingValue", "value")],
        "monthly"
      ),
      value: updateVarb("numObj"),
      itemValueSource: updateVarb("string", {
        initValue: "valueEditor",
      }),
      itemOngoingSwitch: updateVarb("string", {
        initValue: "monthly",
      }),
    }),
    ...updateSectionProp("ongoingList", {
      ...updateVarbsS.ongoingSumNums(
        "total",
        [updateFnPropS.children("ongoingItem", "value")],
        "monthly"
      ),
      itemValueSource: updateVarb("editorValueSource", {
        initValue: "valueEditor",
      }),
      itemOngoingSwitch: updateVarb("string", {
        initValue: "monthly",
      }),
    }),
    ...updateSectionProp("numVarbList", {
      itemValueSource: updateVarb("editorValueSource", {
        initValue: "valueEditor",
      } as const),
    }),
    ...updateSectionProp("outputItem", {
      valueEntityInfo: updateVarb("inEntityValue"),
    }),
    ...updateSectionProp("virtualVarb", {
      valueEntityInfo: updateVarb("inEntityValue"),
      value: updateVarb("numObj", {
        updateFnName: "virtualNumObj",
        updateFnProps: {
          varbInfo: updateFnPropS.local("valueEntityInfo"),
        },
      }),
      displayName: updateVarb("stringObj", {
        updateFnName: "emptyStringObj",
        updateOverrides: [updateOverrideS.loadedVarbProp("loadDisplayName")],
      }),
      startAdornment: updateVarb("stringObj", {
        updateFnName: "emptyStringObj",
        updateOverrides: [updateOverrideS.loadedVarbProp("loadStartAdornment")],
      }),
      endAdornment: updateVarb("stringObj", {
        updateFnName: "emptyStringObj",
        updateOverrides: [updateOverrideS.loadedVarbProp("loadEndAdornment")],
      }),
    }),
    ...updateSectionProp("singleTimeItem", {
      ...updateVarbsS._typeUniformity,
      ...updateVarbsS.displayNameAndEditor,
      value: updateVarb("numObj", {
        updateFnName: "throwIfReached",
        updateOverrides: [
          updateOverride(
            [overrideSwitchS.local("valueSourceName", "valueEditor")],
            updateBasicsS.loadFromLocalValueEditor()
          ),
        ],
      }),
      valueSourceName: updateVarb("customValueSource", {
        initValue: "valueEditor",
      }),
      valueEditor: updateVarb("numObj"),
    }),
    ...updateSectionProp("ongoingItem", ongoingItemUpdateVarbs()),
    ...updateSectionProp("numVarbItem", {
      ...updateVarbsS.displayNameAndEditor,
      value: updateVarb("numObj", {
        initValue: numObj(0),
        updateFnName: "userVarb",
        updateFnProps: {
          ...updateFnPropsS.localByVarbName(["valueSourceName", "valueEditor"]),
          conditionalValue: updateFnPropS.children(
            "conditionalRowList",
            "value"
          ),
        },
      }),
      valueSourceName: updateVarb("editorValueSource", {
        initValue: "valueEditor",
      }),
    }),
    ...updateSectionProp("conditionalRowList", {
      value: updateVarb("numObj", {
        updateFnProps: updateFnPropsS.namedChildren("conditionalRow", {
          rowLevel: "level",
          rowType: "type",
          rowLeft: "left",
          rowOperator: "operator",
          rowRightValue: "rightValue",
          rowRightList: "rightList",
          rowThen: "then",
        }),
      }),
    }),
    ...updateSectionProp("conditionalRow", {
      type: updateVarb("string", { initValue: "if" }),
      operator: updateVarb("string", { initValue: "===" }),
    }),
    ...updateSectionProp("calculatedVarbs", {
      two: updateVarb("numObj", {
        ...updateBasics("two"),
      }),
      onePercentPrice: updateVarb("numObj", {
        ...updateBasicsS.equationSimple(
          "onePercent",
          updateFnPropS.pathNameBase("propertyFocal", "purchasePrice")
        ),
      }),
      twoPercentPrice: updateVarb("numObj", {
        ...updateBasicsS.equationSimple(
          "twoPercent",
          updateFnPropS.pathNameBase("propertyFocal", "purchasePrice")
        ),
      }),
      fivePercentRentMonthly: updateVarb("numObj", {
        ...updateBasicsS.equationSimple(
          "fivePercent",
          updateFnPropS.varbPathName("targetRentMonthly")
        ),
      }),
      fivePercentRentYearly: updateVarb("numObj", {
        ...updateBasicsS.equationSimple(
          "fivePercent",
          updateFnPropS.varbPathName("targetRentYearly")
        ),
      }),
      tenPercentRentMonthly: updateVarb("numObj", {
        ...updateBasicsS.equationSimple(
          "tenPercent",
          updateFnPropS.varbPathName("targetRentMonthly")
        ),
      }),
      tenPercentRentYearly: updateVarb("numObj", {
        ...updateBasicsS.equationSimple(
          "tenPercent",
          updateFnPropS.varbPathName("targetRentYearly")
        ),
      }),
      onePercentPricePlusSqft: updateVarb("numObj", {
        ...updateBasicsS.sumVarbPathName("onePercentPrice", "sqft"),
      }),
      onePercentPriceSqftAverage: updateVarb("numObj", {
        ...updateBasicsS.varbPathLeftRight(
          "simpleDivide",
          "onePercentPricePlusSqft",
          "two"
        ),
      }),
      dealCompletionStatus: updateVarb("completionStatus", {
        initValue: "allEmpty",
        updateFnName: "completionStatus",
        updateFnProps: completionStatusProps({
          othersValid: [
            updateFnPropS.pathName(
              "calculatedVarbsFocal",
              "propertyCompletionStatus"
            ),
            updateFnPropS.pathName(
              "calculatedVarbsFocal",
              "financingCompletionStatus"
            ),
            updateFnPropS.pathName(
              "calculatedVarbsFocal",
              "mgmtCompletionStatus"
            ),
          ],
        }),
      }),
      propertyExists: updateVarb("boolean", {
        initValue: false,
        updateFnName: "varbExists",
        updateFnProps: {
          varbInfo: updateFnPropS.pathName("propertyFocal", "one"),
        },
      }),
      financingExists: updateVarb("boolean", {
        initValue: false,
        updateFnName: "varbExists",
        updateFnProps: {
          varbInfo: updateFnPropS.pathName("financingFocal", "one"),
        },
      }),
      mgmtExists: updateVarb("boolean", {
        initValue: false,
        updateFnName: "varbExists",
        updateFnProps: { varbInfo: updateFnPropS.pathName("mgmtFocal", "one") },
      }),
      propertyCompletionStatus: updateVarb("completionStatus", {
        initValue: "allEmpty",
        updateOverrides: [
          updateOverride(
            [overrideSwitchS.localIsFalse("propertyExists")],
            updateBasics(
              "completionStatus",
              completionStatusProps({
                notFalse: [updateFnPropS.local("propertyExists")],
              })
            )
          ),
        ],
        updateFnName: "completionStatus",
        updateFnProps: completionStatusProps({
          nonZeros: [updateFnPropS.pathName("propertyFocal", "numUnits")],
          nonNone: [
            updateFnPropS.pathName("repairCostFocal", "valueSourceName"),
            updateFnPropS.pathName("utilityCostFocal", "valueSourceName"),
            updateFnPropS.pathName("maintenanceCostFocal", "valueSourceName"),
            updateFnPropS.pathName("capExCostFocal", "valueSourceName"),
          ],
          validInputs: [
            ...updateFnPropsS.varbPathArr("purchasePrice", "sqft"),
            updateFnPropS.pathName("propertyFocal", "taxesOngoingEditor"),
            updateFnPropS.pathName("propertyFocal", "homeInsOngoingEditor"),
            updateFnPropS.pathName("unitFocal", "targetRentOngoingEditor"),
            updateFnPropS.pathName("unitFocal", "numBedrooms"),
            updateFnPropS.pathName("capExCostFocal", "valueDollarsEditor", [
              overrideSwitch(
                mixedInfoS.pathNameVarb("capExCostFocal", "valueSourceName"),
                "valueEditor"
              ),
            ]),
            updateFnPropS.pathName("repairCostFocal", "valueDollarsEditor", [
              overrideSwitch(
                mixedInfoS.pathNameVarb("repairCostFocal", "valueSourceName"),
                "valueEditor"
              ),
            ]),
            updateFnPropS.pathName(
              "maintenanceCostFocal",
              "valueDollarsEditor",
              [
                overrideSwitch(
                  mixedInfoS.pathNameVarb(
                    "maintenanceCostFocal",
                    "valueSourceName"
                  ),
                  "valueEditor"
                ),
              ]
            ),
          ],
        }),
      }),
      mgmtCompletionStatus: updateVarb("completionStatus", {
        initValue: "allEmpty",
        updateOverrides: [
          updateOverride(
            [overrideSwitchS.localIsFalse("mgmtExists")],
            updateBasics(
              "completionStatus",
              completionStatusProps({
                notFalse: [updateFnPropS.local("mgmtExists")],
              })
            )
          ),
        ],
        updateFnName: "completionStatus",
        updateFnProps: completionStatusProps({
          validInputs: [
            updateFnPropS.pathName(
              "mgmtBasePayFocal",
              "valueDollarsOngoingEditor",
              [
                overrideSwitch(
                  mixedInfoS.pathNameVarb(
                    "mgmtBasePayFocal",
                    "valueSourceName"
                  ),
                  "dollarsEditor"
                ),
              ]
            ),
            updateFnPropS.pathName("mgmtBasePayFocal", "valuePercentEditor", [
              overrideSwitch(
                mixedInfoS.pathNameVarb("mgmtBasePayFocal", "valueSourceName"),
                "percentOfRentEditor"
              ),
            ]),
            updateFnPropS.pathName(
              "vacancyLossFocal",
              "valueDollarsOngoingEditor",
              [
                overrideSwitch(
                  mixedInfoS.pathNameVarb(
                    "vacancyLossFocal",
                    "valueSourceName"
                  ),
                  "dollarsEditor"
                ),
              ]
            ),
            updateFnPropS.pathName("vacancyLossFocal", "valuePercentEditor", [
              overrideSwitch(
                mixedInfoS.pathNameVarb("vacancyLossFocal", "valueSourceName"),
                "percentOfRentEditor"
              ),
            ]),
          ],
        }),
      }),
      financingCompletionStatus: updateVarb("completionStatus", {
        initValue: "allEmpty",
        updateFnName: "throwIfReached",
        updateOverrides: [
          updateOverride(
            [overrideSwitchS.localIsFalse("financingExists")],
            updateBasics(
              "completionStatus",
              completionStatusProps({
                notFalse: [updateFnPropS.local("financingExists")],
              })
            )
          ),
          updateOverride(
            [overrideSwitchS.varbIsValue("financingMode", "", "cashOnly")],
            updateBasics(
              "completionStatus",
              completionStatusProps({
                validInputs: [updateFnPropS.varbPathName("financingMode")],
              })
            )
          ),
          updateOverride(
            [overrideSwitchS.varbIsValue("financingMode", "useLoan")],
            updateBasics(
              "completionStatus",
              completionStatusProps({
                validInputs: [
                  updateFnPropS.pathName(
                    "loanBaseFocal",
                    "valueDollarsEditor",
                    [overrideSwitchS.local("valueSourceName", "dollarsEditor")]
                  ),
                  updateFnPropS.pathName(
                    "loanBaseFocal",
                    "valuePercentEditor",
                    [
                      overrideSwitchS.local(
                        "valueSourceName",
                        "percentOfAssetEditor"
                      ),
                    ]
                  ),
                  updateFnPropS.pathName(
                    "loanFocal",
                    "interestRatePercentOngoingEditor"
                  ),
                  updateFnPropS.pathName("loanFocal", "loanTermSpanEditor"),
                  updateFnPropS.pathName(
                    "loanFocal",
                    "mortgageInsUpfrontEditor",
                    [overrideSwitch(relVarbInfoS.local("hasMortgageIns"), true)]
                  ),
                  updateFnPropS.pathName(
                    "loanFocal",
                    "mortgageInsOngoingEditor",
                    [overrideSwitch(relVarbInfoS.local("hasMortgageIns"), true)]
                  ),
                  updateFnPropS.pathName(
                    "closingCostFocal",
                    "valueDollarsEditor",
                    [overrideSwitchS.valueSourceIs("valueEditor")]
                  ),
                ],
              })
            )
          ),
        ],
      }),
    }),
  });
}

export const allUpdateSections = makeAllUpdateSections();
export type AllUpdateSections = typeof allUpdateSections;

type GetUpdateSection<SN extends SectionName> = AllUpdateSections[SN];
export function getUpdateSection<SN extends SectionName>(
  sectionName: SN
): GetUpdateSection<SN> {
  return allUpdateSections[sectionName];
}

type GetUpdateVarb<
  SN extends SectionName,
  VN extends VarbName<SN>
> = GetUpdateSection<SN>[VN & keyof GetUpdateSection<SN>];
export function getUpdateVarb<SN extends SectionName, VN extends VarbName<SN>>(
  sectionName: SN,
  varbName: VN
): GetUpdateVarb<SN, VN> {
  return getUpdateSection(sectionName)[
    varbName as VN & keyof GetUpdateSection<SN>
  ];
}
