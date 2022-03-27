import { omit, pick } from "lodash";
import { NextObjEntries, Obj } from "../utils/Obj";
import { relSections, RelSections } from "./SectionMetas/relSections";
import {
  InVarbRelative,
  NextVarbNames,
  OutRelVarbInfo,
  OutVarbRelative,
  VarbNames,
} from "./SectionMetas/relSections/rel/relVarbInfoTypes";
import {
  InUpdatePack,
  isDefaultInPack,
  isSwitchInPack,
  OutUpdatePack,
  VarbMeta,
} from "./SectionMetas/VarbMeta";
import { SectionNam, SectionName } from "./SectionMetas/SectionName";
import {
  baseSections,
  BaseSections,
  SectionContext,
  SimpleSectionName,
} from "./SectionMetas/relSections/baseSections";
import {
  makeSectionToParentArrs,
  ParentName,
  SectionToParentArrs,
} from "./SectionMetas/relNameArrs/ParentTypes";
import { VarbMetas, VarbMetasRaw } from "./SectionMetas/VarbMetas";

// type TopTierKeys = "a" | "b";
// type SecondTierKeys = {
//   a: "aa" | "bb";
//   b: "bb" | "cc";
// };
// type ObjectToQuery = {
//   [T in TopTierKeys]: {
//     [S in SecondTierKeys[T]]: {
//       data1: T;
//       data2: S;
//     };
//   };
// };
// type UsesKeys<T extends TopTierKeys, S extends SecondTierKeys[T]> = {
//   value: ObjectToQuery[T][S & keyof ObjectToQuery[T]];
// };
// looping in typescript
// using discriminated unions in place of individual arguments

// type SectionNamePlusContext =
//   | {
//       sectionContext: Extract<SectionContext, "fe">;
//       sectionName: SimpleSectionName<"fe">;
//     }
//   | {
//       sectionContext: Extract<SectionContext, "db">;
//       sectionName: SimpleSectionName<"db">;
//     };

export type SectionMeta<
  SN extends SimpleSectionName<SC>,
  SC extends SectionContext = "fe"
> = RelSections[SC][SN & keyof RelSections[SC]] &
  BaseSections[SC][SN] & {
    varbMetas: VarbMetas;
    parents: SectionToParentArrs<SC>[SN];
  };

type SectionMetasCore = {
  [SC in SectionContext]: {
    [SN in SimpleSectionName<SC>]: SectionMeta<SN, SC>;
  };
};
type SectionMetasRaw = {
  [SC in SectionContext]: {
    [SN in SimpleSectionName<SC>]: Omit<
      SectionMetasCore[SC][SN & keyof SectionMetasCore[SC]],
      "varbMetas"
    > & {
      varbMetas: VarbMetasRaw;
    };
  };
};

export class SectionMetas {
  private core: SectionMetasCore;
  constructor() {
    this.core = SectionMetas.initCore();
    this.initOutUpdatePacks();
  }

  get raw() {
    const rawSectionMetas: any = {};
    for (const sectionContext of Obj.keys(this.core)) {
      for (const sectionName of Obj.keys(this.core[sectionContext])) {
        rawSectionMetas[sectionContext][sectionName] = {
          ...omit(this.core[sectionContext][sectionName], ["varbMetas"]),
          varbMetas: this.core[sectionContext][sectionName].varbMetas.raw,
        };
      }
    }
    return rawSectionMetas as SectionMetasRaw;
  }
  get<SN extends SimpleSectionName<SC>, SC extends SectionContext = "fe">(
    sectionName: SN,
    sectionContext?: SC
  ): SectionMeta<SN, SC> {
    const contextCore = this.core[(sectionContext ?? "fe") as SC];
    const sectionCore = contextCore[sectionName as keyof typeof contextCore];
    return sectionCore as any;
  }
  varbNames<SN extends SimpleSectionName<SC>, SC extends SectionContext = "fe">(
    sectionName: SN,
    sectionContext: SC
  ): string[] {
    return this.varbMetas(sectionName, sectionContext).varbNames;
  }
  parentName<
    SN extends SectionName<"hasOneParent", SC>,
    SC extends SectionContext = "fe"
  >(sectionName: SN, sectionContext?: SC): ParentName<SN, SC> {
    const meta = sectionMetas.get(sectionName, sectionContext ?? "fe");
    return meta.parents[0] as ParentName<SN, SC>;
  }
  varbMeta<VNS extends NextVarbNames>(varbNames: VNS): VarbMeta {
    const { sectionName, varbName, sectionContext } = varbNames;
    const varbMeta =
      this.core[sectionContext][sectionName].varbMetas.get(varbName);
    if (!varbMeta) {
      throw new Error(`No varbMeta at ${sectionName}.${varbName}`);
    } else return varbMeta;
  }
  varbMetas<SN extends SimpleSectionName<SC>, SC extends SectionContext = "fe">(
    sectionName: SN,
    sectionContext?: SC
  ): VarbMetas {
    return this.get(sectionName, sectionContext ?? ("fe" as SC)).varbMetas;
  }
  private inToOutRelative<
    SC extends SectionContext,
    SN extends SimpleSectionName<SC>
  >(
    focalSectionName: SN,
    inRelative: InVarbRelative,
    sectionContext: SC
  ): OutVarbRelative {
    const focalFrame = this.core[sectionContext][focalSectionName];
    const childSpecifiers = ["children"] as const;
    if (inRelative === "local") return "local";
    else if (childSpecifiers.includes(inRelative as any)) return "parent";
    else if (inRelative === "static") {
      if (focalFrame.alwaysOne) return "static";
      else return "all";
    } else if (inRelative === "all") {
      if (focalFrame.alwaysOne) return "static";
      // only static variables should have inRelatives of "all"
    }
    throw new Error(`Relative '${inRelative}' is not valid.`);
  }
  makeOutUpdatePack(
    relTargetVarbInfo: OutRelVarbInfo,
    inUpdatePack: InUpdatePack
  ): OutUpdatePack {
    if (isDefaultInPack(inUpdatePack)) {
      return {
        relTargetVarbInfo,
        ...pick(inUpdatePack, ["inverseSwitches"]),
      };
    } else if (isSwitchInPack(inUpdatePack)) {
      return {
        relTargetVarbInfo,
        ...pick(inUpdatePack, ["switchInfo", "switchValue"]),
      };
    }
    throw new Error("Expected one of two InUpdatePacks.");
  }
  inUpdatePackToOuts(
    targetNames: VarbNames<SectionName<"hasVarb">>,
    inUpdatePack: InUpdatePack
  ): void {
    const { inUpdateInfos } = inUpdatePack;
    const { sectionContext } = targetNames;

    for (const info of inUpdateInfos) {
      const { sectionName, varbName, id } = info;
      const outUpdatePack = this.makeOutUpdatePack(
        {
          ...targetNames,
          id: this.inToOutRelative(targetNames.sectionName, id, sectionContext),
          idType: "relative",
        },
        inUpdatePack
      );

      const inVarbMeta = this.varbMeta({
        sectionName,
        varbName,
        sectionContext,
      } as NextVarbNames);
      const { varbMetas } = this.core[sectionContext][sectionName];

      this.core[sectionContext][sectionName].varbMetas = varbMetas.update(
        varbName,
        {
          ...inVarbMeta.core,
          outUpdatePacks: inVarbMeta.outUpdatePacks.concat([outUpdatePack]),
        }
      );
    }
  }
  initOutUpdatePacks() {
    for (const [sectionContext, dbFeSections] of NextObjEntries(this.core)) {
      for (const [sectionName, sectionMeta] of NextObjEntries(dbFeSections)) {
        if (!SectionNam.is(sectionName, "hasVarb")) continue;
        for (const [varbName, varbMeta] of NextObjEntries(
          sectionMeta.varbMetas.getCore()
        )) {
          for (const inUpdatePack of varbMeta.inUpdatePacks) {
            this.inUpdatePackToOuts(
              { sectionName, varbName, sectionContext } as any,
              inUpdatePack
            );
          }
        }
      }
    }
  }
  private static initSectionMeta<
    SC extends SectionContext,
    SN extends SimpleSectionName<SC>,
    PA extends SectionToParentArrs<SC>[SN]
  >(
    sectionContext: SC,
    sectionName: SN,
    parentNameArr: PA
  ): SectionMeta<SN, SC> {
    const relSection = relSections[sectionContext][sectionName];
    const baseSection = baseSections[sectionContext][sectionName];
    return {
      ...relSection,
      ...baseSection,
      varbMetas: VarbMetas.initFromRelVarbs(relSection.relVarbs, sectionName),
      parents: parentNameArr,
    };
  }
  private static initCore(): SectionMetasCore {
    const partial: { [SC in SectionContext]: any } = {
      fe: {},
      db: {},
    };
    const contextSectionToParentArrs = makeSectionToParentArrs();
    for (const [sectionContext, relContextSections] of Obj.entries(
      relSections
    )) {
      const sectionToParentArrs = contextSectionToParentArrs[sectionContext];
      partial[sectionContext]["main"] = this.initSectionMeta(
        sectionContext,
        "main",
        sectionToParentArrs["main"]
      );
      for (const sectionName of Obj.keys(relContextSections)) {
        partial[sectionContext][sectionName] = this.initSectionMeta(
          sectionContext,
          sectionName,
          sectionToParentArrs[sectionName]
        );
      }
    }

    return partial as SectionMetasCore;
  }
}

export const sectionMetas = new SectionMetas();
