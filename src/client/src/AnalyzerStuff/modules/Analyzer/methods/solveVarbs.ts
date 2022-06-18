import { FeVarbInfo } from "../../../../App/sharedWithServer/SectionsMeta/relSections/rel/relVarbInfoTypes";
import { Arr } from "../../../../App/sharedWithServer/utils/Arr";
import Analyzer from "../../Analyzer";
import { solveAndUpdateValue } from "./solveVarbs/solveAndUpdateValue";

export function solveVarbs(
  this: Analyzer,
  varbInfosToSolve: FeVarbInfo[] = []
): Analyzer {
  let next = this;
  varbInfosToSolve.push(...next.getVarbInfosToSolveFor());
  varbInfosToSolve = Arr.rmDuplicateObjsClone(varbInfosToSolve);

  const orderedInfos = next.gatherAndSortInfosToSolve(varbInfosToSolve);
  for (const info of orderedInfos) {
    next = solveAndUpdateValue(next, info);
  }

  return next.updateAnalyzer({
    varbIdsToSolveFor: new Set(),
  });
}

export function solveAllActiveVarbs(this: Analyzer) {
  const { feInfo } = this.singleSection("main");
  const activeNumObjInfos = this.nestedNumObjInfos(feInfo);
  return this.solveVarbs(activeNumObjInfos);
}