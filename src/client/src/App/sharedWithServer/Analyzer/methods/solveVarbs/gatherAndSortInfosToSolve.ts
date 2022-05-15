import Analyzer from "../../../Analyzer";
import { FeVarbInfo } from "../../../SectionsMeta/relSections/rel/relVarbInfoTypes";
import { Arr } from "../../../utils/Arr";
import StateVarb from "../../StateSection/StateVarb";
import tsort from "./tsort/tsort";

type OutVarbMap = Record<string, string[]>;
export function getOutVarbMap(
  this: Analyzer,
  feInfosToSolve: FeVarbInfo[],
  outVarbMap: OutVarbMap = {},
  visitedInfos: string[] = [],
  parentStringInfo?: string
): OutVarbMap {
  for (const info of feInfosToSolve) {
    const stringInfo = StateVarb.feVarbInfoToFullName(info);
    if (visitedInfos.includes(stringInfo)) continue;
    if (!(stringInfo in outVarbMap)) outVarbMap[stringInfo] = [];
    if (parentStringInfo && !outVarbMap[parentStringInfo].includes(stringInfo))
      outVarbMap[parentStringInfo].push(stringInfo);
    visitedInfos.push(stringInfo);
    const outInfos = this.outVarbInfos(info);
    this.getOutVarbMap(outInfos, outVarbMap, visitedInfos, stringInfo);
  }
  return outVarbMap;
}

export function getDagEdgesAndLoneVarbs(
  this: Analyzer,
  varbInfosToSolve: FeVarbInfo[]
) {
  // Many of the switches end up as loneVarbs.
  // I'm not sure if that's detrimental.
  const outVarbMap = this.getOutVarbMap(varbInfosToSolve);
  const edges: [string, string][] = [];
  const loneVarbs = Object.keys(outVarbMap).filter(
    (k) => outVarbMap[k].length === 0
  );
  for (const [stringInfo, outStrings] of Object.entries(outVarbMap)) {
    for (const outString of outStrings) {
      if (loneVarbs.includes(outString))
        Arr.rmFirstValueMutate(loneVarbs, outString);
      edges.push([stringInfo, outString]);
    }
  }
  return { edges, loneVarbs };
}

export function gatherAndSortInfosToSolve(
  this: Analyzer,
  varbInfosToSolve: FeVarbInfo[]
): FeVarbInfo[] {
  const { edges, loneVarbs } = this.getDagEdgesAndLoneVarbs(varbInfosToSolve);
  let solveOrder = tsort(edges);
  solveOrder = solveOrder.concat(loneVarbs);
  return solveOrder.map((stringInfo) =>
    StateVarb.fullNameToFeVarbInfo(stringInfo)
  );
}
