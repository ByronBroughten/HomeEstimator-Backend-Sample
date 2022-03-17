import { AxiosResponse } from "axios";
import { config } from "../../../Constants";
import { is, Req, Res } from "../../../sharedWithServer/User/crudTypes";
import https from "../../services/httpService";
import { DbStoreName } from "../../../sharedWithServer/Analyzer/SectionMetas/relSections/baseSectionTypes";
import { DbEntry } from "../../../sharedWithServer/Analyzer/DbEntry";
import { SectionName } from "../../../sharedWithServer/Analyzer/SectionMetas/SectionName";

const url = {
  dbEntry: config.url.dbEntry.path,
  dbEntryArr: config.url.sectionArr.path,
  dbColArr: config.url.tableColumns.path,
};

const validateRes = {
  dbId(res: AxiosResponse<unknown> | undefined): { data: string } | undefined {
    if (res && is.dbId(res.data))
      return {
        data: res.data,
      };
    else return undefined;
  },
  dbEntry(
    res: AxiosResponse<unknown> | undefined
  ): { data: DbEntry } | undefined {
    if (res && is.dbEntry(res.data))
      return {
        data: res.data,
      };
    else return undefined;
  },
  dbEntryArr(
    res: AxiosResponse<unknown> | undefined
  ): Res<"PostTableColumns"> | undefined {
    if (res && is.dbEntryArr(res.data)) {
      return {
        data: res.data,
      };
    } else return undefined;
  },
};

export const crud = {
  async postEntry(
    reqObj: Req<"PostEntry">
  ): Promise<Res<"PostEntry"> | undefined> {
    const res = await https.post(`saving`, url.dbEntry, reqObj.body);
    return validateRes.dbId(res);
  },
  async postEntryArr(
    reqObj: Req<"PostEntryArr">
  ): Promise<Res<"PostEntryArr"> | undefined> {
    const res = await https.post("saving", url.dbEntryArr, reqObj.body);
    return validateRes.dbId(res);
  },
  async postTableColumns(
    dbEntryArr: DbEntry[],
    dbStoreName: SectionName<"table">
  ) {
    const reqObj: Req<"PostTableColumns"> = {
      body: {
        payload: dbEntryArr,
        dbStoreName,
      },
    };
    const res = await https.post("saving", url.dbColArr, reqObj.body);
    return validateRes.dbEntryArr(res);
  },
  async putEntry(
    dbEntry: DbEntry,
    dbStoreName: DbStoreName
  ): Promise<Res<"PutEntry"> | undefined> {
    const reqObj: Req<"PutEntry"> = {
      body: {
        payload: dbEntry,
        dbStoreName,
      },
    };
    const res = await https.put("updating", url.dbEntry, reqObj.body);
    return validateRes.dbId(res);
  },
  async getEntry(
    dbStoreName: DbStoreName,
    dbId: string
  ): Promise<Res<"GetEntry"> | undefined> {
    const reqObj: Req<"GetEntry"> = {
      params: {
        dbStoreName,
        dbId,
      },
    };
    const res = await https.get(`loading from ${dbStoreName}`, url.dbEntry, [
      ...Object.values(reqObj.params),
    ]);
    return validateRes.dbEntry(res);
  },
  async deleteEntry(
    dbId: string,
    dbStoreName: DbStoreName
  ): Promise<Res<"DeleteEntry"> | undefined> {
    const reqObj: Req<"DeleteEntry"> = {
      params: {
        dbStoreName,
        dbId,
      },
    };
    const res = await https.delete(
      `deleting from ${dbStoreName}`,
      url.dbEntry,
      [...Object.values(reqObj.params)]
    );
    return validateRes.dbId(res);
  },
} as const;
