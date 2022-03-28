import React from "react";
import { useAnalyzerContext } from "../../modules/usePropertyAnalyzer";
import MainSection from "../appWide/MainSection";
import Property from "./PropertyGeneral/Property";
import GeneralSectionTitle from "../appWide/MainSection/GeneralSectionTitle";
import Mgmt from "./Mgmts/Mgmt";

type Props = {
  title: string;
  sectionName: "property" | "mgmt";
  className?: string;
};
const parents = { property: "propertyGeneral", mgmt: "mgmtGeneral" } as const;
export default function InputSection({ title, sectionName, className }: Props) {
  const { analyzer } = useAnalyzerContext();

  const section = analyzer.section(parents[sectionName]);
  const sectionIds = section.childFeIds(sectionName);

  return (
    <MainSection {...{ sectionName, className }}>
      <GeneralSectionTitle {...{ title, sectionName }} />
      <div className="MainSection-entries">
        {sectionIds.map((id) => {
          return sectionName === "property" ? (
            <Property {...{ id, key: id }} />
          ) : sectionName === "mgmt" ? (
            <Mgmt {...{ id, key: id }} />
          ) : null;
        })}
      </div>
    </MainSection>
  );
}
