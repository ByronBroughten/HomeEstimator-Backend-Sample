import { ChildName } from "../../sharedWithServer/SectionsMeta/sectionChildrenDerived/ChildName";
import { ChildSectionName } from "../../sharedWithServer/SectionsMeta/sectionChildrenDerived/ChildSectionName";
import { SectionPack } from "../../sharedWithServer/SectionsMeta/sectionChildrenDerived/SectionPack";
import { SectionNameByType } from "../../sharedWithServer/SectionsMeta/SectionNameByType";
import { GetterSection } from "../../sharedWithServer/StateGetters/GetterSection";
import {
  SolverSectionBase,
  SolverSectionProps,
} from "../../sharedWithServer/StateSolvers/SolverBases/SolverSectionBase";
import { SolverSectionsProps } from "../../sharedWithServer/StateSolvers/SolverBases/SolverSectionsBase";
import { SolverSection } from "../../sharedWithServer/StateSolvers/SolverSection";
import { DisplayItemProps } from "./DisplayListBuilder";

interface FullIndexSolverProps<CN extends ChildName<"feUser">>
  extends SolverSectionProps<"feUser"> {
  itemName: CN;
}

export class FeIndexSolver<
  CN extends ChildName<"feUser">
> extends SolverSectionBase<"feUser"> {
  itemName: CN;
  constructor({ itemName, ...rest }: FullIndexSolverProps<CN>) {
    super(rest);
    this.itemName = itemName;
  }
  static init<CN extends ChildName<"feUser">>(
    itemName: CN,
    props: SolverSectionsProps
  ) {
    const {
      sectionsShare: { sections },
    } = props;
    return new FeIndexSolver({
      ...sections.onlyOneRawSection("feUser"),
      ...props,
      itemName,
    });
  }
  get get() {
    return new GetterSection(this.getterSectionProps);
  }
  get solver() {
    return new SolverSection(this.solverSectionProps);
  }
  get indexSection() {
    return this.solver;
  }
  get indexSectionItems(): GetterSection<SectionNameByType<"hasFullIndex">>[] {
    return this.get.children(this.itemName) as GetterSection<any>[];
  }
  get displayItems(): DisplayItemProps[] {
    return this.indexSectionItems.map((section) => ({
      displayName: section.valueNext("displayName").mainText,
      dbId: section.dbId,
    }));
  }
  getItem(dbId: string): SolverSection<ChildSectionName<"feUser", CN>> {
    return this.solver.childByDbId({
      childName: this.itemName,
      dbId,
    });
  }
  getItemPack(dbId: string): SectionPack<ChildSectionName<"feUser", CN>> {
    return this.getItem(dbId).packMaker.makeSectionPack();
  }
  hasByDbId(dbId: string) {
    return this.get.hasChildByDbInfo({
      childName: this.itemName,
      dbId,
    });
  }
  removeItem(dbId: string) {
    this.indexSection.removeChildByDbId({
      childName: this.itemName,
      dbId,
    });
  }
  addItem(sectionPack: SectionPack<ChildSectionName<"feUser", CN>>): void {
    this.indexSection.loadChild({
      childName: this.itemName,
      sectionPack: sectionPack,
    });
  }
  updateItem(sectionPack: SectionPack<ChildSectionName<"feUser", CN>>) {
    const child = this.indexSection.childByDbId({
      childName: this.itemName,
      dbId: sectionPack.dbId,
    });
    child.loadSelf(sectionPack);
  }
}
