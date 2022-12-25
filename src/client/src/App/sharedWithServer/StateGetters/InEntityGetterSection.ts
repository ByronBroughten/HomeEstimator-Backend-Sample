import { FeSectionInfo, FeVarbInfo } from "../SectionsMeta/SectionInfo/FeInfo";
import { SectionName } from "../SectionsMeta/SectionName";
import { GetterSectionBase } from "./Bases/GetterSectionBase";
import { GetterSection } from "./GetterSection";
import { GetterSections } from "./GetterSections";
import { InEntityGetterVarb } from "./InEntityGetterVarb";

export class InEntityGetterSection<
  SN extends SectionName
> extends GetterSectionBase<SN> {
  get get() {
    return new GetterSection(this.getterSectionProps);
  }
  get getterSections() {
    return new GetterSections(this.getterSectionsProps);
  }
  inEntityVarb(feVarbInfo: FeVarbInfo): InEntityGetterVarb {
    return new InEntityGetterVarb({
      ...this.getterSectionsProps,
      ...feVarbInfo,
    });
  }
  inEntitySection<SN extends SectionName>(
    feInfo: FeSectionInfo<SN>
  ): InEntityGetterSection<SN> {
    return new InEntityGetterSection({
      ...this.getterSectionsProps,
      ...feInfo,
    });
  }
  get selfAndDescendantVarbInfosWithEntities(): FeVarbInfo[] {
    const sectionInfos = this.get.selfAndDescendantSectionInfos;
    return sectionInfos.reduce((feVarbInfos, sectionInfo) => {
      const section = this.inEntitySection(sectionInfo);
      const varbInfos = section.varbArrWithInEntities.map(
        (varb) => varb.feVarbInfo
      );
      return feVarbInfos.concat(...varbInfos);
    }, [] as FeVarbInfo[]);
  }
  private get varbArrWithInEntities() {
    return this.varbArr.filter((varb) => varb.hasInEntities);
  }
  private get varbArr() {
    return this.get.varbArr.map(({ feVarbInfo }) =>
      this.inEntityVarb(feVarbInfo)
    );
  }
  get appWideVarbInfosWithInEntities() {
    const root = this.inEntitySection(this.getterSections.root);
    return root.selfAndDescendantVarbInfosWithEntities;
  }
}