import {
  entityS,
  InEntity,
} from "../../../../../App/sharedWithServer/SectionsMeta/baseSections/baseValues/entities";
import { FeVarbInfo } from "../../../../../App/sharedWithServer/SectionsMeta/relSections/rel/relVarbInfoTypes";
import Analyzer from "../../../Analyzer";
import { internal } from "../internal";

export function updateConnectedEntities(
  analyzer: Analyzer,
  feVarbInfo: FeVarbInfo,
  nextEntities: InEntity[]
): Analyzer {
  const outEntity = {
    ...feVarbInfo,
    entityId: Analyzer.makeId(),
  };

  const currentEntities = analyzer.varb(feVarbInfo).inEntities;
  const missingEntities = currentEntities.filter(
    (entity) => !entityS.entitiesHas(nextEntities, entity)
  );
  const newEntities = nextEntities.filter(
    (entity) => !entityS.entitiesHas(currentEntities, entity)
  );

  let next = analyzer;
  for (const entity of missingEntities) {
    if (next.hasSection(entity)) {
      next = internal.removeInEntity(next, outEntity, entity);
    }
  }

  for (const entity of newEntities) {
    next = internal.addInEntity(next, outEntity, entity);
  }
  return next;
}