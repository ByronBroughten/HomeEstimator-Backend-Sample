import { DbVarbInfoMixed } from "../SectionsMeta/baseSectionsDerived/baseVarbInfo";
import { VirtualVarbName } from "../SectionsMeta/baseSectionsDerived/baseVarbNames";
import calculations, {
  isCalculationName,
  NumberProps,
} from "../SectionsMeta/baseSectionsVarbs/baseValues/calculations";
import {
  InEntities,
  InEntity,
} from "../SectionsMeta/baseSectionsVarbs/baseValues/entities";
import {
  InEntityInfo,
  InEntityInfoValue,
} from "../SectionsMeta/baseSectionsVarbs/baseValues/InEntityInfoValue";
import { NumObj } from "../SectionsMeta/baseSectionsVarbs/baseValues/NumObj";
import { StateValue } from "../SectionsMeta/baseSectionsVarbs/baseValues/StateValueTypes";
import {
  stringObj,
  StringObj,
} from "../SectionsMeta/baseSectionsVarbs/baseValues/StringObj";
import { RelInVarbInfo } from "../SectionsMeta/childSectionsDerived/RelInOutVarbInfo";
import { RelVarbInfo } from "../SectionsMeta/childSectionsDerived/RelVarbInfo";
import { UpdateFnProps } from "../SectionsMeta/relSectionVarbs/rel/relVarbTypes";
import { SectionNameByType } from "../SectionsMeta/SectionNameByType";
import { GetterSectionProps } from "../StateGetters/Bases/GetterSectionBase";
import { GetterVarbBase } from "../StateGetters/Bases/GetterVarbBase";
import { GetterList } from "../StateGetters/GetterList";
import { GetterSection } from "../StateGetters/GetterSection";
import { GetterSections } from "../StateGetters/GetterSections";
import { GetterVarb } from "../StateGetters/GetterVarb";
import { GetterVarbNumObj } from "../StateGetters/GetterVarbNumObj";
import { UpdaterVarb } from "../StateUpdaters/UpdaterVarb";
import { Arr } from "../utils/Arr";
import { ConditionalValueSolver } from "./SolveValueVarb/ConditionalValueSolver";
import { UserVarbValueSolver } from "./SolveValueVarb/UserVarbValueSolver";

export class SolveValueVarb<
  SN extends SectionNameByType<"hasVarb">
> extends GetterVarbBase<SN> {
  private get getterSections() {
    return new GetterSections(this.getterSectionsProps);
  }
  get getterSection(): GetterSection<SN> {
    return new GetterSection(this.getterSectionProps);
  }
  private get getterList() {
    return new GetterList(this.getterListProps);
  }
  private get getterVarb() {
    return new GetterVarb(this.getterVarbProps);
  }
  private get numObjSolver() {
    return new GetterVarbNumObj(this.getterVarbProps);
  }
  private updateFns = {
    manualUpdateOnly: (): StateValue => {
      return this.getterVarb.value();
    },
    string: (): string => {
      return this.getterVarb.value("string");
    },
    stringObj: (): StringObj => {
      return this.getterVarb.value("stringObj");
    },
    loadNumObj: (): NumObj => {
      const { updateFnProps } = this.getterVarb;
      const varb = this.getterSection.varbByFocalMixed(
        updateFnProps.varbInfo as RelVarbInfo
      );
      return varb.value("numObj");
    },
    loadLocalString: (): StringObj => {
      const { updateFnProps } = this.getterVarb;
      const varb = this.getterSection.varbByFocalMixed(
        updateFnProps.loadLocalString as RelInVarbInfo
      );
      return stringObj(varb.value("string"));
    },
    inEntityInfo: (): InEntityInfoValue => {
      return this.getterVarb.value("inEntityInfo");
    },
    loadEditorSolvableText: (): NumObj => {
      const value = this.getterVarb.value("numObj");
      const { solvableText } = this.getterVarb.localValue(
        "numObjEditor",
        "numObj"
      );
      return { ...value, solvableText };
    },
    virtualNumObj: (): NumObj => {
      return {
        ...this.loadNextTexts(),
        entities: this.loadNextEntities(),
      };
    },
    calcVarbs: (): NumObj => {
      const current = this.getterVarb.value("numObj");
      return {
        ...current,
        solvableText: this.solvableTextFromCalcVarbs(),
      };
    },
    loadSolvableText: (): NumObj => {
      const { updateFnProps } = this.getterVarb;
      const varb = this.getterSection.varbByFocalMixed(
        updateFnProps.varbInfo as RelVarbInfo
      );
      return {
        solvableText: varb.value("numObj").solvableText,
        mainText: "",
        entities: [],
      };
    },
    calculation: (): NumObj => {
      const solvableText = this.solvableTextFromCalculation();
      return {
        solvableText,
        mainText: "",
        entities: [],
        // for calculations to load correctly, there must be no entities
      };
    },
    userVarb: (): NumObj => {
      const section = this.getterSection;
      if (section.sectionName === "userVarbItem") {
        const userVarbSolver = new UserVarbValueSolver(
          this.getterSectionProps as GetterSectionProps<"userVarbItem">
        );
        const editor = (
          section as any as GetterSection<"userVarbItem">
        ).varbNext("numObjEditor");
        const editorEntities = editor.inEntities;
        let isPureUserVarb = true;
        for (const entity of editorEntities) {
          if (this.getterSections.hasSectionMixed(entity)) {
            const varb = this.getterSections.varbByMixed(entity);
            if (!(varb.sectionName === "userVarbItem")) {
              isPureUserVarb = false;
              break;
            } else if (!varb.isPureUserVarb) {
              isPureUserVarb = false;
              break;
            }
          }
        }
        const editorUpdater = new UpdaterVarb(editor.getterVarbProps);
        editorUpdater.update({ isPureUserVarb });
        return userVarbSolver.solveValue();
      } else throw new Error("section must contain at least one varb");
    },
    conditionalValue: (): NumObj => {
      if (this.getterVarb.sectionName === "conditionalRowList") {
        const solver = new ConditionalValueSolver(
          this.getterSectionProps as GetterSectionProps<"conditionalRowList">
        );
        return solver.solveValue();
      } else {
        throw new Error("This only works with conditionalRowList");
      }
    },
    emptyStringObj: (): StringObj => {
      return stringObj("");
    },
    loadDisplayName: (): StringObj => {
      return this.valueEntityVarbProp("displayName", "Variable not found");
    },
    loadDisplayNameEnd: (): StringObj => {
      return this.valueEntityVarbProp("displayNameEnd", "");
    },
    loadStartAdornment: (): StringObj => {
      return this.valueEntityVarbProp("startAdornment", "");
    },
    loadEndAdornment: (): StringObj => {
      return this.valueEntityVarbProp("endAdornment", "");
    },
  };
  private valueEntityVarbProp(
    varbPropName: VirtualVarbName,
    notFoundString: string
  ): StringObj {
    const entityInfo = this.getterSection.value(
      "valueEntityInfo",
      "inEntityInfo"
    );
    if (!entityInfo) {
      return stringObj("");
    }
    if (this.getterSections.hasSectionMixed(entityInfo)) {
      const varb = this.getterSections.varbByMixed(entityInfo);
      return stringObj(varb[varbPropName]);
    } else {
      return stringObj(notFoundString);
    }
  }
  solveValue(): StateValue {
    const { updateFnName } = this.getterVarb;
    if (isCalculationName(updateFnName)) return this.updateFns.calculation();
    if (this.isInUpdateFns(updateFnName)) return this.updateFns[updateFnName]();
    else throw new Error(`updateFnName ${updateFnName} not found.`);
  }
  private loadNextEntities(): InEntities {
    const varb = this.getterVarb;
    let nextEntities = [...varb.inEntities];
    const entitySource = "localValueEntityInfo";

    const infoVarb = varb.localVarb("valueEntityInfo");
    function entityIsOfSource(entity: InEntity) {
      return entity.entitySource === entitySource;
    }
    function removeEntityOfSource() {
      Arr.findAndRmMutate(nextEntities, entityIsOfSource);
    }
    function pushEntityOfSource(entityInfo: InEntityInfo) {
      nextEntities.push({
        ...entityInfo,
        entitySource: entitySource,
        length: 0,
        offset: 0,
      });
    }

    const entityInfo = infoVarb.value("inEntityInfo");
    const entityOfSource = nextEntities.find(entityIsOfSource);
    if (entityInfo) {
      if (!entityOfSource) {
        pushEntityOfSource(entityInfo);
      } else {
        const entityIsUpToDate =
          entityOfSource.entityId === entityInfo.entityId;
        if (!entityIsUpToDate) {
          removeEntityOfSource();
          pushEntityOfSource(entityInfo);
        }
      }
    } else if (!entityInfo && entityOfSource) {
      removeEntityOfSource();
    }
    return nextEntities;
  }
  private loadNextTexts(): { mainText: string; solvableText: string } {
    const loadingVarbInfo = this.getterSection.value(
      "valueEntityInfo",
      "inEntityInfo"
    );
    if (
      loadingVarbInfo &&
      this.getterSections.hasSectionMixed(loadingVarbInfo)
    ) {
      const varb = this.getterSections.varbByMixed(loadingVarbInfo);
      return {
        solvableText: varb.value("numObj").solvableText,
        // the mainText is the present numberValue.

        // that is the issue.
        mainText:
          varb.numberOrQuestionMark === "?" ? "" : `${varb.numberValue}`,
      };
    } else {
      return {
        solvableText: "?",
        mainText: "",
      };
    }
  }
  private isInUpdateFns(str: string): str is keyof typeof this.updateFns {
    return str in this.updateFns;
  }
  private solvableTextFromCalcVarbs(): string {
    if (this.getterVarb.updateFnName !== "calcVarbs")
      throw new Error("This is only for calcVarbs");
    const numObj = this.getterVarb.value("numObj");
    return this.numObjSolver.solvableTextFromTextAndEntities(numObj);
  }
  private solvableTextFromCalculation() {
    const { updateFnName } = this.getterVarb;
    if (!isCalculationName(updateFnName))
      throw new Error(
        `updateFnName is ${updateFnName}, but this is only for pure calculations`
      );

    const { updateFnProps } = this.getterVarb;
    const { numberVarbs } = this.getNumberVarbs(updateFnProps);
    const solvableText = calculations[updateFnName](numberVarbs as any);
    if (solvableText.includes("NaN")) {
      throw new Error(
        `solvableText "${solvableText}" includes NaN; derived from updateFn "${updateFnName}"`
      );
    }
    return solvableText;
  }
  private getNumberVarbs(updateFnProps: UpdateFnProps): {
    numberVarbs: NumberProps;
    failedVarbs: FailedVarbs;
  } {
    const numberVarbs: NumberProps = {};
    const failedVarbs: FailedVarbs = [];
    // Ok. I would like to redo this to be able to get props for anything.
    for (let [propName, propOrArr] of Object.entries(updateFnProps)) {
      if (Array.isArray(propOrArr)) numberVarbs[propName] = [];
      else propOrArr = [propOrArr];
      for (const relInfo of propOrArr) {
        const inVarbs = this.getterSection.varbsByFocalMixed(relInfo);
        for (const inVarb of inVarbs) {
          if (inVarb.hasValueType("numObj")) {
            const num = inVarb.numberOrQuestionMark;
            if (num === "?") {
              failedVarbs.push({
                errorMessage: "failed varb",
                ...relInfo,
              });
            }
            const numArr = numberVarbs[propName];
            if (Array.isArray(numArr)) numArr.push(num);
            else numberVarbs[propName] = num;
          } else {
            numberVarbs[propName] = inVarb.value() as any;
          }
        }
      }
    }
    return { numberVarbs, failedVarbs };
  }
}

type UpdateFnValues = Record<string, StateValue>;

export type FailedVarbs = FailedVarb[];
type FailedVarb = { errorMessage: string } & UpdateVarbInfo;
type UpdateVarbInfo = RelVarbInfo | DbVarbInfoMixed;
