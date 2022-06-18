import { EditorState } from "draft-js";
import React from "react";
import { auth } from "../../App/modules/services/authService";
import { FeVarbInfo } from "../../App/sharedWithServer/SectionsMeta/relSections/rel/relVarbInfoTypes";
import { NoProviderErr } from "../../App/utils/react";
import Analyzer from "../modules/Analyzer";
import StateVarb from "../modules/Analyzer/StateSection/StateVarb";
import { DirectUpdateFnValue } from "../modules/Analyzer/StateSection/StateVarb/stateValue";
import { updateFromEditorAndSolve } from "../modules/AnalyzerClientSide/updateFromEditor";
import {
  getStoredAnalyzerState,
  rmStoredStateIfPreframesChanged,
  storeAnalyzerState,
} from "../modules/storedAnalyzerState";

type Props = {
  prePopulatedState?: Analyzer;
  main?: boolean;
};
export default function usePropertyAnalyzer({
  prePopulatedState,
  main,
}: Props) {
  React.useEffect(() => {
    if (main) rmStoredStateIfPreframesChanged();
  }, []);

  const [analyzer, setAnalyzer] = React.useState(
    () =>
      prePopulatedState ?? getStoredAnalyzerState() ?? Analyzer.initAnalyzer()
  );

  const [dropCalculator, setDropCalculator] = React.useState(false);
  function toggleDropCalculator() {
    setDropCalculator((prev) => !prev);
  }
  React.useEffect(() => {
    if (main) storeAnalyzerState(analyzer);
  }, [main, analyzer]);

  const actions = [
    "addSectionAndSolve",
    "loadUserAndSolve",
    "resetSectionAndSolve",
    "copySection",
    "loadSectionArrAndSolve",
    "loadValueFromVarb",
  ] as const;
  type Action = typeof actions[number];
  type Params<A extends Action> = Parameters<typeof analyzer[A]>;
  function handleSet<A extends Action, P extends Params<A>>(
    action: A,
    ...params: P
  ): void {
    setAnalyzer((prev) => {
      const fn: (this: Analyzer, ...params: any) => Analyzer = prev[action];
      return fn.apply(prev, params);
    });
  }

  const specialHandlers = {
    setAnalyzerOrdered: (nextState: Analyzer) => setAnalyzer(() => nextState),
    logout() {
      auth.removeToken();
      setAnalyzer(Analyzer.initAnalyzer());
    },
    handleAddSection(
      ...params: Parameters<typeof analyzer.addSectionAndSolve>
    ) {
      setAnalyzer((prev) => prev.addSectionAndSolve(...params));
    },
    handleRemoveSection(
      // this one must be overridden in useLmAnalyzer
      ...params: Parameters<typeof analyzer.eraseSectionAndSolve>
    ) {
      setAnalyzer((prev) => prev.eraseSectionAndSolve(...params));
    },
    handleDirectUpdate: (
      feVarbInfo: FeVarbInfo,
      value: DirectUpdateFnValue
    ) => {
      setAnalyzer((prev) => prev.directUpdateAndSolve(feVarbInfo, value));
    },
    handleUpdateFromEditor({
      feVarbInfo,
      editorState,
    }: {
      feVarbInfo: FeVarbInfo;
      editorState: EditorState;
    }) {
      setAnalyzer((previousAnalyzer) =>
        updateFromEditorAndSolve(previousAnalyzer, feVarbInfo, editorState)
      );
    },
    handleChange: ({ currentTarget }: { currentTarget: any }) => {
      // needed for certain third-party components
      const { name, value } = currentTarget;
      const feVarbInfo = StateVarb.varbIdToFeVarbInfo(name);
      setAnalyzer((prev) => prev.directUpdateAndSolve(feVarbInfo, value));
    },
  };

  return {
    analyzer,
    setAnalyzer,
    dropCalculator,
    toggleDropCalculator,
    handleSet,
    ...specialHandlers,
  };
}

export const AnalyzerContext = React.createContext<
  ReturnType<typeof usePropertyAnalyzer> | undefined
>(undefined);
AnalyzerContext.displayName = "AnalyzerContext";

export const useAnalyzerContext = () => {
  const context = React.useContext(AnalyzerContext);
  if (context === undefined) throw NoProviderErr("useAnalyzerContext");
  return context;
};