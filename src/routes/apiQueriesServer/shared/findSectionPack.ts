import { Response } from "express";
import { SectionName } from "../../../client/src/App/sharedWithServer/Analyzer/SectionMetas/SectionName";
import { SectionPackDbRaw } from "../../../client/src/App/sharedWithServer/Analyzer/SectionPackRaw";
import { StoredSectionPackInfo } from "../../../client/src/App/sharedWithServer/apiQueriesSharedTypes";
import { getUserById } from "./getUserById";

export type FindSectionPackProps<
  SN extends SectionName<"dbStore"> = SectionName<"dbStore">
> = {
  userId: string;
  spInfo: StoredSectionPackInfo<SN>;
  res: Response;
};

export async function findSectionPack<
  SN extends SectionName<"dbStore"> = SectionName<"dbStore">
>({
  userId,
  spInfo,
  res,
}: FindSectionPackProps<SN>): Promise<SectionPackDbRaw<SN> | undefined> {
  const { dbStoreName, dbId } = spInfo;
  const user = await getUserById({ userId, res });
  return (user[dbStoreName] as { dbId: string }[]).find(
    (sectionPack) => sectionPack.dbId === dbId
  ) as SectionPackDbRaw<SN>;
}
