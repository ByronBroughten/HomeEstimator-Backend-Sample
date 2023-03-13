import { pick } from "lodash";
import { defaultMaker } from "../defaultMaker/defaultMaker";
import { SectionPack } from "../SectionsMeta/sectionChildrenDerived/SectionPack";
import { FeSectionInfo, FeVarbInfo } from "../SectionsMeta/SectionInfo/FeInfo";
import { VarbInfoMixed } from "../SectionsMeta/SectionInfo/MixedSectionInfo";
import { SectionName } from "../SectionsMeta/SectionName";
import { SectionNameByType } from "../SectionsMeta/SectionNameByType";
import { GetterList } from "../StateGetters/GetterList";
import { GetterSections } from "../StateGetters/GetterSections";
import { GetterVarb } from "../StateGetters/GetterVarb";
import { PackBuilderSections } from "../StatePackers.ts/PackBuilderSections";
import { StateSections } from "../StateSections/StateSections";
import { Arr } from "../utils/Arr";
import { OutEntityGetterVarb } from "./../StateInOutVarbs/OutEntityGetterVarb";
import { SolverSectionsBase } from "./SolverBases/SolverSectionsBase";
import { SolverSection } from "./SolverSection";
import tsort from "./SolverSections/tsort/tsort";
import { SolverVarb } from "./SolverVarb";

type OutVarbMap = Record<string, Set<string>>;

export class SolverSections extends SolverSectionsBase {
  get getterSections() {
    return new GetterSections(this.getterSectionsBase.getterSectionsProps);
  }
  private getterList<SN extends SectionName>(sectionName: SN): GetterList<SN> {
    return new GetterList({
      ...this.getterSectionsBase,
      sectionName,
    });
  }
  get builderSections() {
    return new PackBuilderSections(this.getterSectionsBase.getterSectionsProps);
  }
  applyVariablesToDealPages() {
    const { feIds } = this.getterList("dealPage");
    const userVarbPacks = this.getSavedUserVarbPacks();
    for (const feId of feIds) {
      this.applyVarbPacksToDealPage(feId, userVarbPacks);
    }
  }
  applyVariablesToDealPage(feId: string) {
    const userVarbPacks = this.getSavedUserVarbPacks();
    this.applyVarbPacksToDealPage(feId, userVarbPacks);
  }
  private getSavedUserVarbPacks(): SectionPack<"numVarbList">[] {
    const feUser = this.oneAndOnly("feUser");
    const userVarbLists = feUser.get.children("numVarbListMain");
    return userVarbLists.map((list) => list.packMaker.makeSectionPack());
  }
  private applyVarbPacksToDealPage(
    feId: string,
    userVarbPacks: SectionPack<"numVarbList">[]
  ): void {
    const dealPage = this.solverSection({
      sectionName: "dealPage",
      feId,
    });
    dealPage.replaceChildPackArrsAndSolve({
      numVarbList: userVarbPacks,
    });
  }

  oneAndOnly<SN extends SectionName>(sectionName: SN) {
    const { feInfo } = this.getterSections.oneAndOnly(sectionName);
    return this.solverSection(feInfo);
  }
  varbByMixed<SN extends SectionNameByType<"hasVarb">>(
    mixedInfo: VarbInfoMixed<SN>
  ): SolverVarb<SN> {
    const varb = this.getterSections.varbByMixed(mixedInfo);
    return this.solverVarb(varb.feVarbInfo);
  }
  solve() {
    const orderedInfos = this.gatherAndSortInfosToSolve();
    for (const varbInfo of orderedInfos) {
      const solverVarb = this.solverVarb(varbInfo);
      solverVarb.calculateAndUpdateValue();
    }
    this.resetVarbFullNamesToSolveFor();
  }
  private resetVarbFullNamesToSolveFor() {
    this.solveShare.varbIdsToSolveFor = new Set();
  }
  private gatherAndSortInfosToSolve(): FeVarbInfo[] {
    const outVarbMap = this.getOutVarbMap();
    const { edges, loneVarbs } = this.getDagEdgesAndLoneVarbs(outVarbMap);
    let orderedVarbIds = tsort(edges);
    orderedVarbIds = orderedVarbIds.concat(loneVarbs);
    return orderedVarbIds.map((stringInfo) =>
      GetterVarb.varbIdToVarbInfo(stringInfo)
    );
  }

  private getDagEdgesAndLoneVarbs(outVarbMap: OutVarbMap) {
    const edges: [string, string][] = [];
    const loneVarbs = Object.keys(outVarbMap).filter(
      (k) => outVarbMap[k].size === 0
    );
    for (const [stringInfo, outStrings] of Object.entries(outVarbMap)) {
      for (const outString of outStrings) {
        if (loneVarbs.includes(outString))
          Arr.rmFirstMatchMutate(loneVarbs, outString);
        edges.push([stringInfo, outString]);
      }
    }
    return { edges, loneVarbs };
  }

  private getOutVarbMap(): OutVarbMap {
    const outVarbMap: OutVarbMap = {};
    let varbIdsToSolveFor = [...this.varbIdsToSolveFor];

    while (varbIdsToSolveFor.length > 0) {
      const nextVarbsToSolveFor = [] as string[];
      for (const varbId of [...varbIdsToSolveFor]) {
        if (varbId in outVarbMap) continue;
        const { activeOutVarbIds } = this.outVarbGetterById(varbId);
        outVarbMap[varbId] = new Set(activeOutVarbIds);
        nextVarbsToSolveFor.push(...activeOutVarbIds);
      }
      varbIdsToSolveFor = nextVarbsToSolveFor;
    }
    return outVarbMap;
  }
  outVarbGetterById(varbId: string): OutEntityGetterVarb {
    const feVarbInfo = GetterVarb.varbIdToVarbInfo(varbId);
    return new OutEntityGetterVarb({
      ...this.solverSectionsProps,
      ...feVarbInfo,
    });
  }
  solverVarbById(varbId: string): SolverVarb {
    const feVarbInfo = GetterVarb.varbIdToVarbInfo(varbId);
    return this.solverVarb(feVarbInfo);
  }
  solverSection<S extends SectionName>(
    feInfo: FeSectionInfo<S>
  ): SolverSection<S> {
    return new SolverSection({
      ...this.solverSectionsProps,
      ...feInfo,
    });
  }
  solverVarb<S extends SectionName>(feVarbInfo: FeVarbInfo<S>): SolverVarb<S> {
    return new SolverVarb({
      ...this.solverSectionsProps,
      ...feVarbInfo,
    });
  }
  static initSectionsFromDefaultMain(): StateSections {
    const defaultMainPack = defaultMaker.makeSectionPack("main");
    return this.initSolvedSectionsFromMainPack(defaultMainPack);
  }
  static initRoot(): SolverSection<"root"> {
    const sections = StateSections.initWithRoot();
    const rootSection = sections.rawSectionList("root")[0];
    return SolverSection.init({
      ...pick(rootSection, ["sectionName", "feId"]),
      ...SolverSectionsBase.initProps({
        sections,
      }),
    });
  }
  static initMainFromActiveDealPack(
    sectionPack: SectionPack<"deal">
  ): SolverSection<"main"> {
    const solver = this.initRoot();
    const mainSolver = solver.addAndGetChild("main");
    const activeDealPage = mainSolver.onlyChild("activeDealPage");
    const activeDeal = activeDealPage.onlyChild("deal");
    activeDeal.loadSelf(sectionPack);
    return mainSolver;
  }
  static initFromFeUserPack(
    sectionPack: SectionPack<"feUser">
  ): SolverSection<"feUser"> {
    const solver = this.initRoot();
    const mainSolver = solver.addAndGetChild("main");
    mainSolver.loadChild({
      childName: "feUser",
      sectionPack,
    });
    return mainSolver.onlyChild("feUser");
  }
  static initSolverFromMainPack(
    sectionPack: SectionPack<"main">
  ): SolverSection<"main"> {
    const solver = this.initRoot();
    solver.loadChild({
      childName: "main",
      sectionPack,
    });
    return solver.onlyChild("main");
  }
  static initSolvedSectionsFromMainPack(
    sectionPack: SectionPack<"main">
  ): StateSections {
    const main = this.initSolverFromMainPack(sectionPack);
    return main.sectionsShare.sections;
  }
}
