import React from "react";
import styled from "styled-components";
import MainSection from "../../App/components/appWide/GeneralSection";
import GeneralSectionTitle from "../../App/components/appWide/GeneralSection/GeneralSectionTitle";
import { SectionName } from "../../App/sharedWithServer/SectionsMeta/SectionName";
import theme from "../../App/theme/Theme";
import AdditiveList from "./AdditiveList";
import ListManagerTitleRow from "./ListManager/ListManagerTitleRow";
import useLmAnalyzer from "./ListManager/useLmAnalyzer";
import { AnalyzerContext, useAnalyzerContext } from "./usePropertyAnalyzer";

export function useListManager(sectionName: SectionName<"userList">) {
  const { analyzer: mainAnalyzer, setAnalyzer: setMainAnalyzer } =
    useAnalyzerContext();

  const lmContext = useLmAnalyzer({
    sectionName,
    mainAnalyzer,
    setMainAnalyzer,
  });

  const userListIds = lmContext.analyzer
    .singleSection("main")
    .childFeIds(sectionName);

  return {
    ...lmContext,
    userListIds,
  };
}

const titles: Record<SectionName<"userList">, string> = {
  userVarbList: "Variables",
  userSingleList: "One time costs",
  userOngoingList: "Ongoing costs: ",
};

type Props = { sectionName: SectionName<"userList"> };
export default function ListManager({ sectionName }: Props) {
  const {
    discardChanges,
    disableUndo,
    undoEraseSection,
    didChange,
    userListIds,
    saveUserLists,
    ...vmContext
  } = useListManager(sectionName);

  const themeName = "loan";
  return (
    <AnalyzerContext.Provider value={vmContext}>
      <Styled themeName={themeName}>
        <GeneralSectionTitle
          title={titles[sectionName]}
          themeName={themeName}
        />
        <div className="ListManager-entry">
          {/* <Prompt when={didChange} message={"Close without saving changes?"} /> */}
          <ListManagerTitleRow
            {...{
              sectionName,
              disableUndo,
              undoEraseSection,
              didChange,
              saveUserLists,
              discardChanges,
            }}
          />
          <div className="ListManager-collections">
            {userListIds.map((id) => (
              <AdditiveList
                {...{
                  feInfo: { sectionName, id, idType: "feId" },
                  themeName: themeName,
                  listType: sectionName,
                }}
              />
            ))}
          </div>
        </div>
      </Styled>
    </AnalyzerContext.Provider>
  );
}

const Styled = styled(MainSection)`
  position: relative;
  z-index: 0;

  .ListManager-entry {
    overflow: auto;
    width: 100%;
    padding: ${theme.s3};
  }

  .ListManager-collections {
    display: flex;
    margin: ${theme.s2};

    .AdditiveList-root {
      margin: ${theme.s2};
    }
  }
`;