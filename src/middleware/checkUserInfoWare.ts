import { NextFunction, Request, Response } from "express";
import { constants } from "../client/src/App/Constants";
import { LoadedDbUser } from "../useRoutes/routes/apiQueriesShared/DbSections/LoadedDbUser";
import { LoggedInReq } from "../useRoutes/routes/apiQueriesShared/ReqAugmenters";
import { missingTokenError } from "./middlewareShared/missingTokenError";

export function checkUserInfoWare(
  req: Request,
  _: Response,
  next: NextFunction
) {
  const token = req.header(constants.tokenKey.userAuthData);
  if (!token) throw missingTokenError("userJwt");
  const decoded = LoadedDbUser.checkUserAuthToken(token);
  (req as LoggedInReq<any>).body.userJwt = decoded;
  next();
}
