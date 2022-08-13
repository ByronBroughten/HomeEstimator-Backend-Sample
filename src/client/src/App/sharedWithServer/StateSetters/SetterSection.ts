import { pick } from "lodash";
import {
  VarbNameNext,
  VarbValues,
} from "../SectionsMeta/baseSectionsDerived/baseSectionTypes";
import { SwitchEndingKey } from "../SectionsMeta/baseSectionsUtils/RelSwitchVarb";
import {
  ChildName,
  FeChildInfo,
} from "../SectionsMeta/childSectionsDerived/ChildName";
import { ChildSectionName } from "../SectionsMeta/childSectionsDerived/ChildSectionName";
import { ParentNameSafe } from "../SectionsMeta/childSectionsDerived/ParentName";
import { SectionPack } from "../SectionsMeta/childSectionsDerived/SectionPack";
import { FeSectionInfo, FeVarbInfo } from "../SectionsMeta/Info";
import { SectionMeta } from "../SectionsMeta/SectionMeta";
import { SectionName } from "../SectionsMeta/SectionName";
import { SectionOption } from "../StateEntityGetters/VariableGetterSections";
import { GetterSection } from "../StateGetters/GetterSection";
import { GetterVarb } from "../StateGetters/GetterVarb";
import { ChildSectionPackArrs } from "../StatePackers.ts/PackLoaderSection";
import { PackMakerSection } from "../StatePackers.ts/PackMakerSection";
import { SolverSection } from "../StateSolvers/SolverSection";
import {
  AddChildOptions,
  UpdaterSection,
} from "../StateUpdaters/UpdaterSection";
import { SetterSectionBase } from "./SetterBases/SetterSectionBase";
import { SetterSections } from "./SetterSections";
import { SetterVarb } from "./SetterVarb";

export class SetterSection<
  SN extends SectionName
> extends SetterSectionBase<SN> {
  get get(): GetterSection<SN> {
    return new GetterSection(this.getterSectionBase.getterSectionProps);
  }
  get packMaker(): PackMakerSection<SN> {
    return new PackMakerSection(this.getterSectionBase.getterSectionProps);
  }
  get update(): UpdaterSection<SN> {
    return new UpdaterSection(this.getterSectionBase.getterSectionProps);
  }
  private solver = SolverSection.init(
    this.getterSectionBase.getterSectionProps
  );
  get meta(): SectionMeta<SN> {
    return this.get.meta;
  }
  get sections(): SetterSections {
    return new SetterSections(this.setterSectionsProps);
  }
  resetDbId(): void {
    this.update.newDbId();
    this.setSections();
  }
  setterSection<S extends SectionName>(
    feInfo: FeSectionInfo<S>
  ): SetterSection<S> {
    return new SetterSection({
      ...this.setterSectionsProps,
      ...feInfo,
    });
  }
  childFeIds(childName: ChildName<SN>): string[] {
    return this.get.childFeIds(childName);
  }
  oneChildFeId(childName: ChildName<SN>): string {
    const ids = this.childFeIds(childName);
    if (ids.length !== 1) {
      throw new Error(
        `Here, section "${this.get.sectionName}" should have exactly one of this child, "${childName}, but has ${ids.length}".`
      );
    }
    return ids[0];
  }
  get parent(): SetterSection<ParentNameSafe<SN>> {
    return new SetterSection({
      ...this.setterSectionProps,
      ...this.get.parentInfoSafe,
    });
  }
  onlyChild<CN extends ChildName<SN>>(
    childName: CN
  ): SetterSection<ChildSectionName<SN, CN>> {
    const feId = this.oneChildFeId(childName);
    return this.child({
      childName,
      feId,
    });
  }
  child<CN extends ChildName<SN>>(
    childInfo: FeChildInfo<SN, CN>
  ): SetterSection<ChildSectionName<SN, CN>> {
    const feInfo = this.get.childToFeInfo(childInfo);
    return this.setterSection(feInfo);
  }
  loadSelfSectionPack(sectionPack: SectionPack<SN>): void {
    this.solver.loadSelfSectionPackAndSolve(sectionPack);
    this.setSections();
  }
  updateValues(values: VarbValues): void {
    this.solver.updateValuesAndSolve(values);
    this.setSections();
  }
  addChild<CN extends ChildName<SN>>(
    childName: CN,
    options?: AddChildOptions<SN, CN>
  ): void {
    this.solver.addChildAndSolve(childName, options);
    this.setSections();
  }
  addAndGetChild<CN extends ChildName<SN>>(
    childName: CN,
    options?: AddChildOptions<SN, CN>
  ): SetterSection<ChildSectionName<SN, CN>> {
    this.addChild(childName, options);
    const { feInfo } = this.get.youngestChild(childName);
    return this.setterSection(feInfo);
  }
  removeChild(childInfo: FeChildInfo<SN>): void {
    this.solver.removeChildAndSolve(childInfo);
    this.setSections();
  }
  removeChildren(childName: ChildName<SN>): void {
    this.solver.removeChildrenAndSolve(childName);
    this.setSections();
  }
  loadChildPackArrs(childPackArrs: Partial<ChildSectionPackArrs<SN>>): void {
    this.solver.loadChildPackArrsAndSolve(childPackArrs);
    this.setSections();
  }
  removeSelf(): void {
    this.solver.removeSelfAndSolve();
    this.setSections();
  }
  replaceWithDefault(): void {
    this.solver.replaceWithDefaultAndSolve();
    this.setSections();
  }
  resetToDefault(): void {
    this.solver.resetToDefaultAndSolve();
    this.setSections();
  }
  varb(varbName: VarbNameNext<SN>): SetterVarb<SN> {
    return new SetterVarb({
      ...this.setterSectionProps,
      varbName: varbName as string,
    });
  }
  varbInfo(varbName: VarbNameNext<SN>): FeVarbInfo<SN> {
    return this.get.varbInfo(varbName);
  }
  switchVarbInfo(
    varbNameBase: string,
    switchEnding: SwitchEndingKey
  ): FeVarbInfo<SN> {
    return this.get.switchVarbInfo(varbNameBase, switchEnding);
  }
  switchVarb(
    varbNameBase: string,
    switchEnding: SwitchEndingKey
  ): GetterVarb<SN> {
    return this.get.switchVarb(varbNameBase, switchEnding);
  }
  get feSectionInfo(): FeSectionInfo<SN> {
    return this.get.feSectionInfo;
  }
  get feInfo(): FeSectionInfo<SN> {
    return this.get.feInfo;
  }
  get siblingOptions(): SectionOption[] {
    return this.get.siblings.map(
      (sibling) => pick(sibling, ["dbId", "displayName"]) as SectionOption
    );
  }
}
