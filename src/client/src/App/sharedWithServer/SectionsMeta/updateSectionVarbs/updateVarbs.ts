import { switchKeyToVarbNames } from "../allBaseSectionVarbs/baseSwitchNames";
import {
  ongoingPureCalc,
  ongoingSumNums,
  updateGroupS,
} from "./switchUpdateVarbs";
import { UpdateSectionVarbs } from "./updateSectionVarbs";
import { UpdateVarb, updateVarb, updateVarbS } from "./updateVarb";
import { updateBasicsS } from "./updateVarb/UpdateBasics";
import { updateFnPropS } from "./updateVarb/UpdateFnProps";
import {
  overrideSwitchS,
  updateOverride,
  updateOverrideS,
} from "./updateVarb/UpdateOverrides";

export const updateVarbsS = {
  ...updateGroupS,
  get _typeUniformity() {
    return { _typeUniformity: updateVarb("string") };
  },
  get savableSection() {
    return {
      displayName: updateVarb("stringObj"),
      dateTimeFirstSaved: updateVarb("dateTime"),
      dateTimeLastSaved: updateVarb("dateTime"),
      syncStatus: updateVarb("syncStatus", {
        initValue: "unsyncedChanges",
      }),
      autoSyncControl: updateVarb("autoSyncControl", {
        initValue: "autoSyncOff",
      }),
    } as const;
  },
  ongoingPureCalc,
  ongoingSumNums,
  get basicVirtualVarb() {
    return {
      displayName: updateVarb("stringObj", {
        updateFnName: "loadDisplayName",
        updateFnProps: {
          varbInfo: updateFnPropS.local("valueEntityInfo"),
        },
      }),
      displayNameEnd: updateVarb("stringObj", {
        updateFnName: "loadDisplayNameEnd",
        updateFnProps: {
          varbInfo: updateFnPropS.local("valueEntityInfo"),
        },
      }),
      startAdornment: updateVarb("stringObj", {
        updateFnName: "loadStartAdornment",
        updateFnProps: {
          varbInfo: updateFnPropS.local("valueEntityInfo"),
        },
      }),
      endAdornment: updateVarb("stringObj", {
        updateFnName: "loadEndAdornment",
        updateFnProps: {
          varbInfo: updateFnPropS.local("valueEntityInfo"),
        },
      }),
    } as const;
  },
  get displayNameAndEditor(): {
    displayNameEditor: UpdateVarb<"string">;
    displayName: UpdateVarb<"stringObj">;
  } {
    return {
      displayNameEditor: updateVarbS.displayNameEditor,
      displayName: updateVarb("stringObj", {
        updateFnName: "loadLocalString",
        updateFnProps: {
          localString: updateFnPropS.local("displayNameEditor"),
        },
      }),
    };
  },
  get virtualVarb() {
    return {
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
    } as const;
  },
  get listItemVirtualVarb(): {
    displayNameEditor: UpdateVarb<"string">;
    displayName: UpdateVarb<"stringObj">;
    valueEntityInfo: UpdateVarb<"inEntityValue">;
    displayNameEnd: UpdateVarb<"stringObj">;
    startAdornment: UpdateVarb<"stringObj">;
    endAdornment: UpdateVarb<"stringObj">;
  } {
    return {
      ...this.displayNameAndEditor,
      displayNameEnd: updateVarb("stringObj", {
        updateFnName: "emptyStringObj",
        updateOverrides: [updateOverrideS.loadedVarbProp("loadDisplayNameEnd")],
      }),
      valueEntityInfo: updateVarb("inEntityValue"),
      startAdornment: updateVarb("stringObj", {
        updateFnName: "emptyStringObj",
        updateOverrides: [updateOverrideS.loadedVarbProp("loadStartAdornment")],
      }),
      endAdornment: updateVarb("stringObj", {
        updateFnName: "emptyStringObj",
        updateOverrides: [updateOverrideS.loadedVarbProp("loadEndAdornment")],
      }),
    } as const;
  },
  singleTimeItem(): UpdateSectionVarbs<"singleTimeItem"> {
    return {
      ...this._typeUniformity,
      ...this.listItemVirtualVarb,
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
    };
  },
  ongoingItem(): UpdateSectionVarbs<"ongoingItem"> {
    const valueNameBase = "value";
    const ongoingValueNames = switchKeyToVarbNames(valueNameBase, "ongoing");
    return {
      ...this._typeUniformity,
      ...this.listItemVirtualVarb,
      valueSourceName: updateVarb("editorValueSource", {
        initValue: "valueEditor",
      }),
      valueEditor: updateVarb("numObj"),
      [ongoingValueNames.switch]: updateVarb("string", {
        initValue: "monthly",
      }),
      [ongoingValueNames.monthly]: updateVarb("numObj", {
        updateFnName: "throwIfReached",
        updateOverrides: [
          updateOverride(
            [overrideSwitchS.monthlyIsActive("value")],
            updateBasicsS.loadFromLocal("valueEditor")
          ),
          updateOverrideS.activeYearlyToMonthly(valueNameBase),
        ],
      }),
      [ongoingValueNames.yearly]: updateVarb("numObj", {
        updateFnName: "throwIfReached",
        updateOverrides: [
          updateOverride(
            [overrideSwitchS.yearlyIsActive("value")],
            updateBasicsS.loadFromLocal("valueEditor")
          ),
          updateOverrideS.activeMonthlyToYearly(valueNameBase),
        ],
      }),
    };
  },
};
