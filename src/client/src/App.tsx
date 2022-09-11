import { StylesProvider } from "@material-ui/core";
import React from "react";
import ReactGA from "react-ga4";
import { BrowserRouter } from "react-router-dom";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { Normalize } from "styled-normalize";
import { SuperTokensWrapper } from "supertokens-auth-react";
import { initSupertokens } from "./App/modules/initSupertokens";
import {
  SectionsContext,
  useSections,
} from "./App/sharedWithServer/stateClassHooks/useSections";
import GlobalStyle from "./App/theme/globalStyles";
import { Theme } from "./App/theme/Theme";
import { Main } from "./Main";

initSupertokens();
ReactGA.initialize("G-19TRW4YTJL");
ReactGA.send("pageview");
const App: React.FC = () => {
  const sectionsContext = useSections({ storeSectionsLocally: true });
  return (
    <SuperTokensWrapper>
      <React.StrictMode>
        <Normalize />
        <StylesProvider injectFirst>
          <Theme>
            <BrowserRouter>
              <SectionsContext.Provider value={sectionsContext}>
                <GlobalStyle />
                <Main />
                <ToastContainer />
              </SectionsContext.Provider>
            </BrowserRouter>
          </Theme>
        </StylesProvider>
      </React.StrictMode>
    </SuperTokensWrapper>
  );
};
export default App;
