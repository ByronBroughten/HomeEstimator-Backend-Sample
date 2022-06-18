import { SectionPackRaw } from "../SectionPack/SectionPackRaw";
import { FeSectionInfo } from "../SectionsMeta/Info";
import { ChildName } from "../SectionsMeta/relSectionTypes/ChildTypes";
import { ParentNameSafe } from "../SectionsMeta/relSectionTypes/ParentTypes";
import { SectionName } from "../SectionsMeta/SectionName";
import { GetterSection } from "../StateGetters/GetterSection";
import { GetterVarb } from "../StateGetters/GetterVarb";
import { PackLoaderSection } from "../StatePackers.ts/PackLoaderSection";
import { DefaultOrNewChildAdder } from "../StateUpdaters/DefaultOrNewDescendantAdder";
import { AddChildOptions } from "../StateUpdaters/UpdaterSection";
import {
  SolverSectionBase,
  SolverSectionProps,
} from "./SolverBases/SolverSectionBase";
import { SolverVarb } from "./SolverVarb";

type AddSolverShare = { addedVarbIds: Set<string> };
interface AddSolverSectionProps<SN extends SectionName>
  extends SolverSectionProps<SN> {
  addSolveShare: AddSolverShare;
}

export class AddSolverSection<
  SN extends SectionName
> extends SolverSectionBase<SN> {
  readonly addSolveShare: AddSolverShare;
  constructor({ addSolveShare, ...rest }: AddSolverSectionProps<SN>) {
    super(rest);
    this.addSolveShare = addSolveShare;
  }
  get = new GetterSection(this.getterSectionProps);
  private get loader() {
    return new PackLoaderSection(this.getterSectionProps);
  }
  static init<S extends SectionName>(
    props: SolverSectionProps<S>
  ): AddSolverSection<S> {
    return new AddSolverSection({
      ...props,
      addSolveShare: { addedVarbIds: new Set() },
    });
  }
  get addedVarbIds(): Set<string> {
    return this.addSolveShare.addedVarbIds;
  }
  private get defaultAdder() {
    return new DefaultOrNewChildAdder(this.getterSectionProps);
  }
  addSolverSection<S extends SectionName>(
    feInfo: FeSectionInfo<S>
  ): AddSolverSection<S> {
    return new AddSolverSection({
      ...this.solverSectionsProps,
      addSolveShare: this.addSolveShare,
      ...feInfo,
    });
  }
  get parent(): AddSolverSection<ParentNameSafe<SN>> {
    const { parentInfoSafe } = this.get;
    return this.addSolverSection(parentInfoSafe);
  }
  youngestChild<CN extends ChildName<SN>>(childName: CN): AddSolverSection<CN> {
    const { feInfo } = this.get.youngestChild(childName);
    return this.addSolverSection(feInfo);
  }

  loadChildAndCollectVarbIds<CN extends ChildName<SN>>(
    sectionPack: SectionPackRaw<CN>
  ): void {
    this.loader.loadChildSectionPack(sectionPack);
    const child = this.youngestChild(sectionPack.sectionName);
    child.collectNestedVarbIds();
  }
  addChildAndFinalize<CN extends ChildName<SN>>(
    childName: ChildName<SN>,
    options?: AddChildOptions<CN>
  ): void {
    this.defaultAdder.addChild(childName, options);
    const child = this.youngestChild(childName);
    child.finalizeAddAndExtractVarbIds();
  }
  private collectNestedVarbIds() {
    const { selfAndDescendantVarbIds } = this.get;
    this.addToAddedVarbIds(...selfAndDescendantVarbIds);
  }
  private addToAddedVarbIds(...varbIds: string[]): void {
    this.addSolveShare.addedVarbIds = new Set([
      ...this.addedVarbIds,
      ...varbIds,
    ]);
  }
  finalizeAddAndExtractVarbIds() {
    this.collectNestedVarbIds();
    this.finalizeVarbsAndExtractIds();
  }
  finalizeVarbsAndExtractIds() {
    this.addAllOutEntitiesOfAddedInEntities();
    this.addVarbIdsToSolveFor(...this.addedVarbIds);
    this.addSolveShare.addedVarbIds = new Set();
  }
  private addAllOutEntitiesOfAddedInEntities() {
    for (const varbId of this.addedVarbIds) {
      const varbInfo = GetterVarb.varbIdToVarbInfo(varbId);
      const solverVarb = new SolverVarb({
        ...this.solverSectionsProps,
        ...varbInfo,
      });
      solverVarb.addOutEntitiesOfInEntities();
    }
  }
}