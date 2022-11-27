import { Request, Response } from "express";
import { constants } from "../../client/src/App/Constants";
import { QueryReq } from "../../client/src/App/sharedWithServer/apiQueriesShared/apiQueriesSharedTypes";
import { makeRes } from "../../client/src/App/sharedWithServer/apiQueriesShared/makeReqAndRes";
import { getAuthWare } from "../../middleware/authWare";
import { ResStatusError } from "../../utils/resError";
import { getStripe } from "../routeUtils/stripe";
import { LoadedDbUser } from "./apiQueriesShared/DbSections/LoadedDbUser";
import { Authed, validateAuthObj } from "./apiQueriesShared/ReqAugmenters";
import { sendSuccess } from "./apiQueriesShared/sendSuccess";

export async function getCustomerPortalUrl(req: Request, res: Response) {
  const { auth } = validateUpgradeUserToProReq(req).body;
  const dbUser = await LoadedDbUser.getBy("authId", auth.id);
  const { customerId } = dbUser;

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

export const getProPaymentUrlWare = [getAuthWare(), getProPaymentUrl] as const;
async function getProPaymentUrl(req: Request, res: Response) {
  if (constants.isBeta) {
    throw new ResStatusError({
      errorMessage:
        "Attempted to upgrade to pro while prohibited during Beta testing",
      resMessage: "Upgrading to pro is not allowed at this point in Beta",
      status: 400,
    });
  }

  const { auth, priceId } = validateUpgradeUserToProReq(req).body;

  const dbUser = await LoadedDbUser.getBy("authId", auth.id);
  const { customerId, email } = dbUser;

  // should this be implemented?: checkIfAlreadySubscribed(userId);

  const stripe = getStripe();
  const session = await stripe.checkout.sessions.create({
    mode: "subscription",
    subscription_data: {
      trial_period_days: 7,
    },
    success_url: constants.clientUrlBase + constants.feRoutes.subscribeSuccess,
    cancel_url: constants.clientUrlBase,
    customer_email: email,
    ...(customerId ? { customer: customerId } : {}),

    line_items: [
      {
        price: priceId,
        quantity: 1,
      },
    ],
  });

  const sessionUrl = validateSessionUrl(session.url);
  sendSuccess(res, "getProPaymentUrl", { data: { sessionUrl } });
}
type Req = Authed<QueryReq<"getProPaymentUrl">>;
function validateUpgradeUserToProReq(req: Authed<any>): Req {
  const { auth, priceId } = (req as Req).body;
  if (typeof priceId === "string") {
    return {
      body: {
        priceId,
        auth: validateAuthObj(auth),
      },
    };
  } else throw new Error("Failed getProPaymentUrl validation.");
}

function validateSessionUrl(url: any): string {
  if (typeof url === "string") {
    return url;
  } else {
    throw new ResStatusError({
      errorMessage: "Failed to connect to Stripe session.",
      resMessage:
        "There was an error connecting to the payment provider. Please try again later, or contact the support email at the bottom of the screen.",
      status: 404,
    });
  }
}
