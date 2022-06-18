import React from "react";
import styled from "styled-components";
import LogicOperators from "../../../../../../../App/components/appWide/LogicOperators";
import MaterialSelect from "../../../../../../../App/components/inputs/MaterialSelect";
import { InfoS } from "../../../../../../../App/sharedWithServer/SectionsMeta/Info";
import { listOperators } from "../../../../../../modules/Analyzer/methods/solveVarbs/solveAndUpdateValue/updateUserVarb";
import ListEditor from "../../../../../ListEditor";
import NumObjEditor from "../../../../../NumObjEditor";
import { useAnalyzerContext } from "../../../../../usePropertyAnalyzer";

const sectionName = "conditionalRow";
export default function IfLogic({ rowId }: { rowId: string }) {
  const { analyzer, handleChange } = useAnalyzerContext();

  const feInfo = { sectionName, id: rowId, idType: "feId" } as const;
  const varbs = analyzer.section(feInfo).varbs;

  const operator = varbs.operator.value("string");

  let logicType: string;
  if (listOperators.includes(operator as any)) {
    logicType = "listLogic";
  } else {
    logicType = "valueLogic";
  }

  const onChange = (e: React.ChangeEvent<{ name?: string; value: any }>) => {
    handleChange({ currentTarget: e.target });
  };

  return (
    <Styled>
      <NumObjEditor
        feVarbInfo={InfoS.feVarb("left", feInfo)}
        className="logic-left"
        bypassNumeric={true}
      />
      <MaterialSelect
        {...{
          name: varbs.operator.stringFeVarbInfo,
          value: operator,
          onChange,
          className: "select-operator",
        }}
      >
        {LogicOperators()}
      </MaterialSelect>
      {logicType === "listLogic" && (
        <ListEditor
          className="logic-right"
          feVarbInfo={InfoS.feVarb("rightList", feInfo)}
        />
      )}
      {logicType === "valueLogic" && (
        <NumObjEditor
          className="logic-right"
          feVarbInfo={InfoS.feVarb("rightValue", feInfo)}
          labeled={false}
        />
      )}
    </Styled>
  );
}

const Styled = styled.div`
  display: flex;
  .select-operator {
    margin: 0 0.25rem;
  }
`;