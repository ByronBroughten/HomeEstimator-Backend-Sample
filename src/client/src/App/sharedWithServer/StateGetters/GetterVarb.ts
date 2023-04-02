import { cloneDeep, round } from "lodash";
import { DisplayOverrideSwitches } from "../SectionsMeta/displaySectionVarbs/displayVarb";
import { FeInfoS, FeVarbInfo } from "../SectionsMeta/SectionInfo/FeInfo";
import {
  mixedInfoS,
  VarbInfoMixedFocal,
} from "../SectionsMeta/SectionInfo/MixedSectionInfo";
import { relVarbInfoS } from "../SectionsMeta/SectionInfo/RelVarbInfo";
import {
  DbVarbInfoMixed,
  FeVarbInfoMixed,
  VarbNames,
} from "../SectionsMeta/SectionInfo/VarbInfoBase";
import { SectionNameByType } from "../SectionsMeta/SectionNameByType";
import { StrAdornments } from "../SectionsMeta/values/EditorValue";
import {
  StateValue,
  StateValueOrAny,
  ValueNameOrAny,
} from "../SectionsMeta/values/StateValue";
import { NumberOrQ } from "../SectionsMeta/values/StateValue/NumObj";
import { isObjValue } from "../SectionsMeta/values/valueMetas";
import { ValueName } from "../SectionsMeta/values/ValueName";
import { VarbMeta } from "../SectionsMeta/VarbMeta";
import { StateVarb } from "../StateSections/StateSectionsTypes";
import { mathS, NotANumberError } from "../utils/math";
import { GetterVarbBase } from "./Bases/GetterVarbBase";
import { GetterSection } from "./GetterSection";
import { GetterSections } from "./GetterSections";
import { GetterVarbNumObj } from "./GetterVarbNumObj";
import { InEntityGetterVarb } from "./InEntityGetterVarb";

class ValueTypeError extends Error {}

export class GetterVarb<
  SN extends SectionNameByType<"hasVarb"> = SectionNameByType<"hasVarb">
> extends GetterVarbBase<SN> {
  get numObj(): GetterVarbNumObj<SN> {
    return new GetterVarbNumObj(this.getterVarbProps);
  }
  get inEntity(): InEntityGetterVarb<SN> {
    return new InEntityGetterVarb(this.getterVarbProps);
  }
  get getterSection() {
    return new GetterSection(this.getterSectionProps);
  }
  get section() {
    return this.getterSection;
  }
  get sections() {
    return new GetterSections(this.getterSectionsProps);
  }
  get feVarbInfo(): FeVarbInfo<SN> {
    return {
      ...this.feSectionInfo,
      varbName: this.varbName,
    };
  }
  checkObjValue(): { isEmpty: boolean; isValid: boolean } {
    const value = this.multiValue("numObj", "stringObj", "string");
    const text = typeof value === "string" ? value : value.mainText;
    if (!text) {
      return {
        isEmpty: true,
        isValid: false,
      };
    } else {
      return {
        isEmpty: false,
        isValid: true,
      };
    }
  }
  get numberValue(): number {
    // figure out how to make NaN result in an error or questionMark
    const val = this.value("any");
    if (val && typeof val === "object" && "solvableText" in val) {
      const numString = this.numObj.solveTextToNumStringNext();
      return mathS.parseFloatStrict(numString);
    } else {
      return mathS.parseFloatStrict(`${val}`);
    }
  }
  get stringValue(): string {
    const val = this.value("any");
    if (val) {
      if (typeof val === "string") {
        return val;
      } else if (isObjValue(val)) {
        return val.mainText;
      }
    }
    return `${val}`;
  }
  get numberOrZero(): number {
    try {
      return this.numberValue;
    } catch (ex) {
      if (ex instanceof NotANumberError) {
        return 0;
      } else {
        throw ex;
      }
    }
  }
  get displayNumber(): NumberOrQ {
    const num = this.numberOrQuestionMark;
    if (typeof num === "number") {
      return round(num, this.meta.displayRound);
    } else return num;
  }
  get numberOrQuestionMark(): NumberOrQ {
    try {
      let val = this.numberValue;
      if (`${val}` === "NaN") {
        throw new Error("no NaN allowed");
      }
      return val;
    } catch (ex) {
      if (ex instanceof NotANumberError) {
        return "?";
      } else {
        throw ex;
      }
    }
  }
  get feVarbInfoMixed(): FeVarbInfoMixed<SN> {
    const { sectionName, feId, varbName } = this.feVarbInfo;
    return mixedInfoS.makeFeVarb(sectionName, feId, varbName);
  }
  dbVarbInfoMixed(): DbVarbInfoMixed<SN> {
    return {
      ...this.section.dbInfoMixed(),
      varbName: this.varbName,
    };
  }
  get raw(): StateVarb<SN> {
    return this.sectionsShare.sections.rawVarb({
      ...this.feVarbInfo,
    });
  }
  get isPureUserVarb(): boolean {
    return this.raw.isPureUserVarb;
  }
  get dbId() {
    return this.getterSection.dbId;
  }
  get varbId() {
    return GetterVarb.feVarbInfoToVarbId(this.feVarbInfo);
  }
  hasValueType<VT extends ValueName>(valueName: VT): boolean {
    try {
      this.value(valueName);
      return true;
    } catch (ex) {
      if (ex instanceof ValueTypeError) return false;
      else throw ex;
    }
  }
  value<VT extends ValueNameOrAny = "any">(
    valueName?: VT
  ): StateValueOrAny<VT> {
    const { value } = this.raw;
    if ([this.valueName, "any"].includes(valueName ?? "any")) {
      return cloneDeep(value) as StateValueOrAny<VT>;
    } else {
      throw new ValueTypeError(
        `Value of ${this.sectionName}.${this.varbName} not of type ${valueName}`
      );
    }
  }
  multiValue<VT extends ValueName>(...valueNames: VT[]): StateValueOrAny<VT> {
    const { value } = this.raw;
    for (const valueName of valueNames) {
      const meta = this.sectionsMeta.valueByName(valueName);
      if (meta.is(value)) {
        return cloneDeep(value) as StateValueOrAny<VT>;
      }
    }
    throw new ValueTypeError(
      `Value of ${this.sectionName}.${
        this.varbName
      } not of type ${valueNames.join(" ")}`
    );
  }
  valueNext() {
    const value = this.value();
    if (this.meta.isVarbValueType(value)) {
      return value;
    } else {
      throw new Error(`value ${value} is not of type ${this.meta.valueName}`);
    }
  }
  valueSafe<AV extends any>(acceptedValues: readonly AV[]): AV {
    const value = this.valueNext() as any;
    if (acceptedValues.includes(value)) {
      return value;
    } else {
      throw new Error(
        `value "${value}" is not included in acceptedValues: ${acceptedValues.toString()}`
      );
    }
  }
  get valueName(): ValueName {
    return this.meta.valueName;
  }
  get displaySource(): GetterVarb<any> {
    let source: GetterVarb<any> = this;
    let finder = this.meta.displaySourceFinder;

    let reps = 0;
    while (finder !== null) {
      if (relVarbInfoS.isLocal(finder)) {
        source = this.section.varbByFocalMixed(finder);
      } else if (Array.isArray(finder)) {
        for (const override of finder as DisplayOverrideSwitches) {
          const switchVarb = this.section.varbByFocalMixed(override.switchInfo);
          const switchValue = switchVarb.value("string");
          if (override.switchValue === switchValue) {
            source = this.section.varbByFocalMixed(override.sourceInfo);
            break;
          }
        }
      }
      finder = source.meta.displaySourceFinder;
      reps += 1;
      if (reps > 3) {
        throw new Error(
          "varbs shouldn't have many stacked sources for their displayVarb information"
        );
      }
    }
    return source;
  }
  get displayMeta(): VarbMeta<any> {
    return this.displaySource.meta;
  }
  get displayInfo() {
    const { displayMeta } = this;
    return {
      displayName: displayMeta.displayName as string,
      displayNameEnd: displayMeta.displayNameEnd,
      displayNameStart: displayMeta.displayNameStart,
      startAdornment: displayMeta.startAdornment,
      endAdornment: displayMeta.endAdornment,
    };
  }
  get displayName(): string {
    const { displayName } = this.displayMeta;
    if (typeof displayName === "string") {
      return displayName;
    } else {
      return this.section.varbByFocalMixed(displayName).value("stringObj")
        .mainText;
    }
  }
  get displayNameFull(): string {
    const { displayNameFullContext } = this.displayMeta;
    if (typeof displayNameFullContext === "string") {
      return displayNameFullContext;
    } else {
      return this.section
        .varbByFocalMixed(displayNameFullContext)
        .value("stringObj").mainText;
    }
  }
  get displayNameStart(): string {
    return this.displayMeta.displayNameStart;
  }
  get sectionDotVarbName() {
    return `${this.sectionName}.${this.varbName}`;
  }
  get displayNameEnd(): string {
    return this.displayMeta.displayNameEnd;
  }
  get startAdornment(): string {
    return this.displayMeta.startAdornment;
  }
  get endAdornment(): string {
    return this.displayMeta.endAdornment;
  }
  get displayValue(): string {
    if (this.hasValueType("numObj")) {
      return `${this.displayNumber}`;
    } else return `${this.value()}`;
  }
  displayVarb({ startAdornment, endAdornment }: Partial<StrAdornments> = {}) {
    const { displayMeta } = this;
    return `${startAdornment ?? displayMeta.startAdornment}${
      this.displayValue
    }${endAdornment ?? displayMeta.endAdornment}`;
  }
  localVarb(varbName: string) {
    return this.getterSection.varb(varbName);
  }
  localValue<VT extends ValueNameOrAny>(
    varbName: string,
    valueName?: VT
  ): StateValueOrAny<VT> {
    return this.localVarb(varbName).value(valueName ?? ("any" as VT));
  }
  getterVarb<S extends SectionNameByType>(
    varbInfo: FeVarbInfo<S>
  ): GetterVarb<S> {
    return new GetterVarb({
      ...this.getterSectionsProps,
      ...varbInfo,
    });
  }
  varbsByFocalMixed(multiVarbInfo: VarbInfoMixedFocal): GetterVarb[] {
    return this.section.varbsByFocalMixed(multiVarbInfo);
  }
  inputProps(valueName?: ValueNameOrAny): {
    id: string;
    name: string;
    value: StateValue;
    label: string;
  } {
    return {
      id: this.varbName,
      name: this.varbName,
      value: this.value(valueName ?? "any"),
      label: this.displayName,
    };
  }
  nearestAnscestor<S extends SectionNameByType>({
    sectionName,
    varbName,
  }: VarbNames<S>): GetterVarb<S> {
    const anscestor = this.getterSection.nearestAnscestor(sectionName);
    return anscestor.varb(varbName);
  }
  static feVarbInfoToVarbId(info: FeVarbInfo): string {
    const { sectionName, varbName, feId } = info;
    return [sectionName, varbName, feId].join(".");
  }
  static varbInfosToVarbIds(varbInfos: FeVarbInfo[]): string[] {
    return varbInfos.map((varbInfo) => {
      return GetterVarb.feVarbInfoToVarbId(varbInfo);
    });
  }
  static varbIdToVarbInfo(varbId: string): FeVarbInfo {
    const [sectionName, varbName, feId] = varbId.split(".") as [
      SectionNameByType,
      string,
      string
    ];
    const info = { sectionName, varbName, feId };
    if (FeInfoS.isVarbInfo(info)) return info;
    else throw new Error(`Was passed an invalid varbId: ${varbId}`);
  }
}
