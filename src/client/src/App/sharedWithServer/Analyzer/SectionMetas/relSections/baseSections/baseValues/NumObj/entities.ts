import { z } from "zod";
import { reqMonNumber, reqMonString } from "../../../../../../utils/mongoose";
import { zNumber, zString } from "../../../../../../utils/zod";
import {
  FeVarbInfo,
  RelInfoStatic,
  StaticRelVarbInfo,
  zDbVarbInfo,
  zImmutableRelVarbInfo,
  DbUserDefVarbInfo,
} from "../../../rel/relVarbInfoTypes";
import { pick } from "lodash";
import { OutEntity } from "../../../../../StateSection/StateVarb/entities";
import { Id } from "../../id";

export const zInEntityVarbInfo = z.union([zDbVarbInfo, zImmutableRelVarbInfo]);
export type InEntityVarbInfo = DbUserDefVarbInfo | StaticRelVarbInfo;
export type InEntityInfo = DbUserDefVarbInfo | RelInfoStatic;

const zInEntityBase = z.object({
  entityId: zString,
  length: zNumber,
  offset: zNumber,
});
const zDbInEntity = zInEntityBase.merge(zDbVarbInfo);
const zImmutableRelInEntity = zInEntityBase.merge(zImmutableRelVarbInfo);
const zInEntity = z.union([zDbInEntity, zImmutableRelInEntity]);
export const zInEntities = z.array(zInEntity);
type InEntityBase = z.infer<typeof zInEntityBase>;
type DbInEntity = InEntityBase & DbUserDefVarbInfo;
type StaticRelInEntity = InEntityBase & StaticRelVarbInfo;
export type InEntity = DbInEntity | StaticRelInEntity;
export type InEntities = InEntity[];
// As things stand, I can't infer much from the zod schemas because
// there isn't a convenient way to make their sectionName enforce
// SectionName<"alwaysOne">.

// where should I put makeId?
// it will need to be in base, if NumObj is in base

export const Ent = {
  inEntity(
    varbInfo: InEntityVarbInfo,
    entityInfo: { offset: number; length: number }
  ): InEntity {
    return {
      entityId: Id.make(),
      ...varbInfo,
      ...entityInfo,
    } as const;
  },
  outEntity(feVarbInfo: FeVarbInfo, inEntity: InEntity): OutEntity {
    return {
      ...feVarbInfo,
      ...pick(inEntity, ["entityId"]),
    };
  },
  entitiesHas(
    entities: (InEntity | OutEntity)[],
    entity: InEntity | OutEntity
  ): boolean {
    const match = entities.find((e) => e.entityId === entity.entityId);
    if (match) return true;
    else return false;
  },
} as const;

export type EntityMapData = InEntityVarbInfo & { entityId: string };
export const mEntityFrame: { [key in keyof InEntity]: any } = {
  entityId: reqMonString,
  offset: reqMonNumber,
  length: reqMonNumber,
  sectionName: reqMonString,
  varbName: reqMonString,
  id: reqMonString,
  idType: reqMonString,
};