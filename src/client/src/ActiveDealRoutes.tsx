import { Navigate, Outlet, Route } from "react-router-dom";
import {
  ActiveDealFinancing,
  ActiveDealMgmt,
  ActiveDealProperty,
} from "./App/components/ActiveDealPage/ActiveDeal/PropertyGeneral/ActiveDealSections";
import { ActiveDealMain } from "./App/components/ActiveDealPage/ActiveDealMain";
import { feRoutes } from "./App/Constants/feRoutes";
import { useGetterSections } from "./App/sharedWithServer/stateClassHooks/useGetterSections";
import { IdOfSectionToSaveProvider } from "./App/sharedWithServer/stateClassHooks/useIdOfSectionToSave";

export const ActiveDealRoutes = (
  <Route path={feRoutes.activeDeal} element={<ActiveDealController />}>
    <Route index element={<ActiveDealMain />} />
    <Route path={feRoutes.activeProperty} element={<ActiveDealProperty />} />
    <Route path={feRoutes.activeFinancing} element={<ActiveDealFinancing />} />
    <Route path={feRoutes.activeMgmt} element={<ActiveDealMgmt />} />
  </Route>
);

function ActiveDealController() {
  const getters = useGetterSections();
  if (getters.hasActiveDeal()) {
    return <ActiveDealWrapper />;
  } else {
    return <Navigate to={feRoutes.account} />;
  }
}
function ActiveDealWrapper() {
  const getters = useGetterSections();
  const deal = getters.getActiveDeal();
  return (
    <IdOfSectionToSaveProvider sectionId={deal.sectionId}>
      <Outlet />
    </IdOfSectionToSaveProvider>
  );
}
