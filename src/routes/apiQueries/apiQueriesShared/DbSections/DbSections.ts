import { DbSectionPack } from "../../../../client/src/App/sharedWithServer/SectionsMeta/sectionChildrenDerived/DbSectionPack";
import {
  DbStoreInfo,
  DbStoreName,
} from "../../../../client/src/App/sharedWithServer/SectionsMeta/sectionChildrenDerived/DbStoreName";
import { DbSectionsBase } from "./Bases/DbSectionsBase";
import { DbUser } from "./DbUser";
import { SectionPackNotFoundError } from "./DbUserTypes";

export interface DbSectionsInitByIdProps {
  userId: string;
}
export interface DbSectionsInitByEmailProps {
  email: string;
}
export class DbSections extends DbSectionsBase {
  onlySectionPack<CN extends DbStoreName>(dbStoreName: CN): DbSectionPack<CN> {
    const sectionPacks = this.dbSectionsRaw[dbStoreName];
    if (sectionPacks.length !== 1) {
      throw new Error(
        `There are ${sectionPacks.length} sectionPacks with sectionName ${dbStoreName}, but there should be exactly 1.`
      );
    }
    return sectionPacks[0] as DbSectionPack<any>;
  }
  sectionPackArr<CN extends DbStoreName>(dbStoreName: CN): DbSectionPack<CN>[] {
    const packArr = this.dbSectionsRaw[dbStoreName];
    if (packArr) return packArr as DbSectionPack<any>[];
    else {
      console.log(`No packArr exists with dbStoreName ${dbStoreName}`);
      return [];
    }
  }
  sectionPack<CN extends DbStoreName>({
    dbStoreName,
    dbId,
  }: DbStoreInfo<CN>): DbSectionPack<CN> {
    const dbPack = [...this.dbSectionsRaw[dbStoreName]].find(
      (dbPack) => dbPack.dbId === dbId
    );
    if (dbPack) {
      return dbPack as DbSectionPack<any>;
    } else {
      throw new SectionPackNotFoundError({
        errorMessage: `dbSectionPack not found at ${dbStoreName}.${dbId}`,
        resMessage: "The requested entry was not found",
        status: 404,
      });
    }
  }
  hasSection({ dbStoreName, dbId }: DbStoreInfo): boolean {
    const sectionPack = [...this.dbSectionsRaw[dbStoreName]].find(
      (section) => section.dbId === dbId
    );
    if (sectionPack) return true;
    else return false;
  }
  static async initByEmail({
    email,
  }: DbSectionsInitByEmailProps): Promise<DbSections> {
    const querier = await DbUser.initByEmail(email);
    return new DbSections({
      dbSectionsRaw: await querier.getDbSectionsRaw(),
    });
  }
  static async initById({
    userId,
  }: DbSectionsInitByIdProps): Promise<DbSections> {
    const querier = await DbUser.initBy("userId", userId);
    return new DbSections({
      dbSectionsRaw: await querier.getDbSectionsRaw(),
    });
  }
}
