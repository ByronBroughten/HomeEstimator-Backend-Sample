import { Request, Response } from "express";
import { DbEntry } from "../../client/src/App/sharedWithServer/Analyzer/DbEntry";
import { DbStoreName } from "../../client/src/App/sharedWithServer/Analyzer/SectionMetas/relSections/baseSectionTypes/dbStoreNames";
import {
  SectionNam,
  SectionName,
  SectionNameType,
} from "../../client/src/App/sharedWithServer/Analyzer/SectionMetas/SectionName";
import { isLoginFormData } from "../../client/src/App/sharedWithServer/apiQueriesShared/login";
import {
  areGuestAccessSections,
  GuestAccessSections,
  isRegisterFormData,
  RegisterFormData,
} from "../../client/src/App/sharedWithServer/apiQueriesShared/register";
import {
  ApiQueryName,
  NextRes,
} from "../../client/src/App/sharedWithServer/apiQueriesSharedTypes";
import { is, Req, Res } from "../../client/src/App/sharedWithServer/Crud";
import {
  LoggedIn,
  LoggedInUser,
} from "../apiQueriesServer/shared/validateLoggedInUser";

export function sendSuccess<QN extends ApiQueryName>(
  res: Response,
  _queryName: QN,
  resObj: NextRes<QN>
) {
  const { headers } = resObj as any;
  res.header(headers).status(200).send(resObj.data);
}

type SuccessProps = {
  res: Response;
  resObj: { data: any; headers?: { [key: string]: string } };
};
export const serverSend = {
  success({ res, resObj: { data, headers } }: SuccessProps) {
    res.header(headers).status(200).send(data);
  },
  nextSuccess<QN extends ApiQueryName>(queryName: QN) {},
  falsyQuery(res: Response, queryName: string = "query") {
    res.status(404).send(`${queryName} returned falsy`);
  },
  resDataIsInvalid(res: Response, whatInvalid: string) {
    res.status(500).send(`Valid ${whatInvalid} not provided for response data`);
  },
};

export const serverValidate = {
  registerFormData(value: any, res: Response): value is RegisterFormData {
    if (isRegisterFormData(value)) return true;
    else {
      res.status(400).send("Invalid register form data.");
      return false;
    }
  },
  guestAccessSections(value: any, res: Response): value is GuestAccessSections {
    if (areGuestAccessSections(value)) return true;
    else {
      res.status(500).send("Invalid guest access sections.");
      return false;
    }
  },
  loginFormData(value: any, res: Response): value is RegisterFormData {
    if (isLoginFormData(value)) return true;
    else {
      res.status(400).send("Invalid login form data.");
      return false;
    }
  },
  payloadIsObjOr500(value: any, res: Response): value is any {
    if (typeof value === "object") return true;
    else {
      res.status(500).send("Payload is not an object.");
      return false;
    }
  },

  payloadIsObj(value: any, res: Response): value is any {
    if (typeof value === "object") return true;
    else {
      res.status(500).send("Payload is not an object.");
      return false;
    }
  },
  userIsLoggedIn(value: any, res: Response): value is LoggedInUser {
    if (typeof value === "object" && typeof value._id === "string") return true;
    else {
      res.status(400).send("You are not properly logged in.");
      return false;
    }
  },
  sectionName<T extends SectionNameType>(
    value: any,
    res: Response,
    sectionNameType: T
  ): value is SectionName<T> {
    if (SectionNam.is(value, sectionNameType)) return true;
    else {
      res.status(500).send("Invalid database store name.");
      return false;
    }
  },
  dbStoreName(value: any, res: Response): value is DbStoreName {
    return this.sectionName(value, res, "dbStore");
  },
  dbId(value: any, res: Response): value is string {
    if (is.dbId(value)) return true;
    else {
      res.status(500).send("Invalid database id.");
      return false;
    }
  },
  dbEntry(value: any, res: Response): value is DbEntry {
    if (is.dbEntry(value)) return true;
    else {
      res.status(500).send("The payload is not a valid database entry.");
      return false;
    }
  },
  dbEntryArr(value: any, res: Response): value is DbEntry[] {
    if (is.dbEntryArr(value)) return true;
    else {
      res.status(500).send("The payload is not a valid database entry array.");
      return false;
    }
  },
} as const;

export const validate = {
  postTableColumns: {
    req(
      req: Request,
      res: Response
    ): LoggedIn<Req<"PostTableColumns">> | undefined {
      const { user, dbStoreName, payload } = req.body;
      if (
        serverValidate.userIsLoggedIn(user, res) &&
        serverValidate.sectionName(dbStoreName, res, "table") &&
        serverValidate.dbEntryArr(payload, res)
      ) {
        return {
          body: {
            user,
            dbStoreName,
            payload,
          },
        };
      } else return;
    },
    res(res: Response, data: DbEntry[]) {
      if (is.dbEntryArr(data)) {
        const resObj: Res<"PostTableColumns"> = { data };
        serverSend.success({ res, resObj });
      } else serverSend.resDataIsInvalid(res, "DbEntryArr");
    },
  },
};
