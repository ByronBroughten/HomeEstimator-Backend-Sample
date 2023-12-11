import { Request, Response } from "express";
import { constants } from "../../client/src/App/Constants";
import { makeRes } from "../../client/src/App/sharedWithServer/apiQueriesShared/makeReqAndRes";
import { LoadedDbUser } from "../../database/LoadedDbUser";
import { getAuthWare, validateEmptyAuthReq } from "../../middleware/authWare";

import { sendSuccess } from "./routesShared/sendSuccess";
import { getStripe } from "./routesShared/stripe";

export const getCustomerPortalUrlWare = [
  getAuthWare(),
  getCustomerPortalUrl,
] as const;
async function getCustomerPortalUrl(req: Request, res: Response) {
  const { auth } = validateEmptyAuthReq(req).body;
  const dbUser = await LoadedDbUser.getBy("authId", auth.id);
  const { customerId } = dbUser;
  if (!customerId) {
    throw new Error(`"customerId" hasn't been set yet for this user`);
  }
  const stripe = getStripe();
  const session = await stripe.billingPortal.sessions.create({
    customer: customerId,
    return_url: constants.clientUrlBase,
  });
  sendSuccess(
    res,
    "getCustomerPortalUrl",
    makeRes({ sessionUrl: session.url })
  );
}
