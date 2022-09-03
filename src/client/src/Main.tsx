import React from "react";
import ReactGA from "react-ga4";
import * as reactRouterDom from "react-router-dom";
import { Route, Routes } from "react-router-dom";
import styled from "styled-components";
import { getSuperTokensRoutesForReactRouterDom } from "supertokens-auth-react";
import { ActiveDeal } from "./App/components/ActiveDeal";
import NotFound from "./App/components/general/NotFound";
import NavBar from "./App/components/NavBar";
import { UserAdditiveListPage } from "./App/components/UserAdditiveListPage";
import { UserOutputListPage } from "./App/components/UserOutputListPage";
import { UserVarbListPage } from "./App/components/UserVarbListPage";
import { constants } from "./App/Constants";
import {
  useAuthAndLogin,
  useSubscriptionState,
} from "./App/modules/customHooks/useAuthAndUserData";
import { useSetterSection } from "./App/sharedWithServer/stateClassHooks/useSetterSection";
import theme from "./App/theme/Theme";

ReactGA.initialize("G-19TRW4YTJL");
ReactGA.send("pageview");

export function Main() {
  const { feRoutes } = constants;

  const main = useSetterSection();
  const feUser = main.get.onlyChild("feUser");
  const { logout } = useAuthAndLogin();
  useSubscriptionState();
  const activeDealId = main.get.onlyChild("deal").feId;
  return (
    <Styled className="App-root">
      <NavBar {...{ logout }} />
      <div className="NavSpaceDiv-root"></div>
      <Routes>
        {/* <Route
          path="/deals"
          element={
            <TableStore feId={feUser.onlyChild("dealMainTable").feId} />
          }
        /> */}
        {getSuperTokensRoutesForReactRouterDom(reactRouterDom)}
        <Route path={feRoutes.userVariables} element={<UserVarbListPage />} />
        <Route path={feRoutes.userLists} element={<UserAdditiveListPage />} />
        <Route path={feRoutes.userOutputs} element={<UserOutputListPage />} />
        <Route
          path={feRoutes.subscribeSuccess}
          element={<ActiveDeal feId={activeDealId} />}
        />
        <Route
          path={feRoutes.authSuccess}
          element={<ActiveDeal feId={activeDealId} loginSuccess={true} />}
        />
        <Route path="/not-found" element={<NotFound />} />
        <Route path={"/"} element={<ActiveDeal feId={activeDealId} />} />
        <Route path="*" element={<NotFound />} />
      </Routes>
    </Styled>
  );
}

const Styled = styled.div`
  display: flex;
  flex-direction: column;
  min-height: 100vh;
  background-color: ${theme.light};

  .NavBar-root {
    position: sticky;
  }
  .NavSpaceDiv-root {
    height: ${theme.s3};
  }
`;
