import React from "react";
import { react } from "../../utils/react";
import { StateSections } from "../StateSections/StateSections";
import { SolverSections } from "../StateSolvers/SolverSections";
import { StrictOmit } from "../utils/types";
import { sectionsReducer, StateAction } from "./useSections/sectionsReducer";
import {
  SectionsStore,
  StateMissingFromStorageError,
  useLocalSectionsStore,
} from "./useSections/SectionsStore";

export type SetSections = React.Dispatch<React.SetStateAction<StateSections>>;
type UseSectionsProps = {
  prePopulatedSections?: StateSections;
  storeSectionsLocally?: boolean;
};
export type SectionsDispatch = React.Dispatch<StateAction>;
export interface SectionsAndControls {
  sectionsDispatch: React.Dispatch<StateAction>;
  sections: StateSections;
}

function useSections(
  initializeSections: () => StateSections
): [StateSections, SectionsDispatch] {
  const [sections, sectionsDispatch] = React.useReducer(
    sectionsReducer,
    StateSections.initEmpty(),
    initializeSections
  );
  return [sections, sectionsDispatch];
}

export function useDealLabSections({
  prePopulatedSections,
  storeSectionsLocally = false,
}: UseSectionsProps = {}): SectionsAndControls {
  const [sections, sectionsDispatch] = useSections(() =>
    initializeAnalyzerSections(prePopulatedSections)
  );
  useLocalSectionsStore({
    storeSectionsLocally,
    sections,
  });
  return {
    sections,
    sectionsDispatch,
  };
}

type UseSectionsReturn = ReturnType<typeof useDealLabSections>;
export type SectionsValue = StrictOmit<UseSectionsReturn, "sectionsDispatch">;

function initializeAnalyzerSections(prePopulatedSections?: StateSections) {
  if (prePopulatedSections) return prePopulatedSections;
  else
    try {
      return SectionsStore.getStoredSections();
    } catch (err) {
      if (err instanceof StateMissingFromStorageError) {
        return SolverSections.initSectionsFromEmptyMain().stateSections;
      } else throw err;
    }
}

export const [SectionsContext, useSectionsContext] =
  react.makeContextUseContext("SectionContext", {} as SectionsValue);

export const [SectionsDispatchContext, useSectionsDispatch] =
  react.makeContextUseContext(
    "SectionsDispatchContext",
    {} as SectionsDispatch
  );

type Props = {
  sectionsContext: SectionsAndControls;
  children: React.ReactNode;
};
export function SectionsContextProvider({ sectionsContext, children }: Props) {
  return (
    <SectionsContext.Provider value={sectionsContext}>
      <SectionsDispatchContext.Provider
        value={sectionsContext.sectionsDispatch}
      >
        {children}
      </SectionsDispatchContext.Provider>
    </SectionsContext.Provider>
  );
}
