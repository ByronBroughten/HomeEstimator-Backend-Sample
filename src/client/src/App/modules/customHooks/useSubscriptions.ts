import React from "react";
import { useLocation } from "react-router-dom";
import { constants } from "../../../sharedWithServer/Constants";
import { StateValue } from "../../../sharedWithServer/sectionVarbsConfig/StateValue";
import { timeS } from "../../../sharedWithServer/utils/timeS";
import { useGoToPage } from "../../components/customHooks/useGoToPage";
import { useGetterSectionOnlyOne } from "../../stateClassHooks/useGetterSection";
import { useQueryAction } from "../../stateClassHooks/useQueryAction";
import { getErrorMessage } from "../../utils/error";

export function useSubscriptions() {
  useUpdateOnSubscribe();
  useUpdateOnExpire();
}

export function useUserSubscription(): {
  userPlan: StateValue<"labSubscription">;
  userPlanExpiration: number;
  userIsPro: boolean;
} {
  const user = useGetterSectionOnlyOne("feStore");
  const userPlan = user.valueNext("labSubscription");
  const userPlanExpiration = user.valueNext("labSubscriptionExp");
  return {
    userPlan,
    userPlanExpiration,
    userIsPro: userPlan === "fullPlan",
  };
}

function useUpdateOnSubscribe() {
  const queryAction = useQueryAction();

  const { pathname } = useLocation();

  const goToAccount = useGoToPage("account");
  React.useEffect(() => {
    async function updateOnSubscribe() {
      if (pathname.endsWith(constants.feRoutes.subscribeSuccess)) {
        try {
          queryAction({ type: "updateSubscriptionData" });
        } catch (ex) {
          throw new Error(getErrorMessage(ex));
        }
        goToAccount();
      }
    }
    updateOnSubscribe();
  });
}

function useUpdateOnExpire() {
  const queryAction = useQueryAction();
  const { userPlanExpiration } = useUserSubscription();

  React.useEffect(() => {
    if (userPlanExpiration < timeS.now()) {
      queryAction({ type: "updateSubscriptionData" });
    }
  });
}
