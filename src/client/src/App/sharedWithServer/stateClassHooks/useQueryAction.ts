import { unstable_batchedUpdates } from "react-dom";
import { useGoToPage } from "../../components/appWide/customHooks/useGoToPage";
import { QuerierSections } from "../../modules/SectionActors/QuerierSections";
import { useLogout } from "../../modules/SectionActors/UserDataActor";
import { userTokenS } from "../../modules/services/userTokenS";
import { makeReq } from "../apiQueriesShared/makeReqAndRes";
import { useDispatchAndSave } from "./useAction";
import { useSectionsContext } from "./useSections";
import { SectionsAction } from "./useSections/sectionsReducer";

interface LoadUserData {
  type: "loadUserData";
}

interface TrySaveAttempt {
  type: "trySave";
}
type QueryAction = TrySaveAttempt | LoadUserData;
type QueryActionName = QueryAction["type"];

export type SectionActionsTypeMap = {
  [ST in QueryActionName]: Extract<SectionsAction, { type: ST }>;
};
type ActionPropsMap = {
  [AN in QueryActionName]: Omit<SectionActionsTypeMap[AN], "type">;
};
export type ActionProps<T extends QueryActionName> = ActionPropsMap[T];

export function useQueryAction() {
  const { sections } = useSectionsContext();
  const dispatch = useDispatchAndSave();
  const logout = useLogout();
  const goToAccountPage = useGoToPage("account");

  return async (action: QueryAction) => {
    const querierSections = QuerierSections.init({
      sectionsShare: { sections },
    });
    const { apiQueries } = querierSections;
    let success: boolean = true;
    switch (action.type) {
      case "loadUserData": {
        try {
          const res = await apiQueries.getUserData(makeReq({}));
          userTokenS.setTokenFromHeaders(res.headers);
          unstable_batchedUpdates(async () => {
            dispatch({
              type: "loadUserData",
              userData: res.data,
            });
            goToAccountPage();
          });
        } catch (error) {
          const count = querierSections.feStore.get.valueNext(
            "userDataFetchTryCount"
          );
          if (count > 5) {
            logout();
            throw error;
          } else {
            setTimeout(
              () => dispatch({ type: "incrementGetUserDataTry" }),
              3000
            );
          }
        }
      }
      case "trySave": {
        try {
          success = await querierSections.feStore.trySave();
          dispatch({
            type: "finishSave",
            success,
          });
        } catch (error) {
          dispatch({
            type: "finishSave",
            success: false,
          });
          throw error;
        }
        break;
      }
    }
  };
}
