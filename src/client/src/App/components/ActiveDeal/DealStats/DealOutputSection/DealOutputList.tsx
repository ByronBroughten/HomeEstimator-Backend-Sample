import styled from "styled-components";
import { inEntityInfo } from "../../../../sharedWithServer/SectionsMeta/baseSectionsVarbs/baseValues/InEntityInfoValue";
import { useSetterSection } from "../../../../sharedWithServer/stateClassHooks/useSetterSection";
import { VariableOption } from "../../../../sharedWithServer/StateEntityGetters/VariableGetterSections";
import theme from "../../../../theme/Theme";
import { LabeledOutputRow } from "../../../appWide/LabeledOutputRow";
import { LabeledVarbOutput } from "../../../appWide/LabeledVarbOutput";

export default function DealOutputList({ feId }: { feId: string }) {
  const outPutList = useSetterSection({
    sectionName: "outputList",
    feId,
  });

  const onSelectNext = ({ varbInfo }: VariableOption) =>
    outPutList.addChild("outputItem", {
      dbVarbs: { valueEntityInfo: inEntityInfo(varbInfo) },
    });

  return (
    <Styled className="BasicAnalysis-root">
      <LabeledOutputRow>
        {outPutList.childFeIds("outputItem").map((outputId) => (
          <LabeledVarbOutput key={outputId} feId={outputId} />
        ))}
      </LabeledOutputRow>
    </Styled>
  );
}

// .VarbAutoComplete-root {
//   position: relative;
//   top: 2px;
//   .MuiInputBase-root {
//     height: ${theme.bigButtonHeight};
//     border-radius: ${theme.br1};
//     margin-left: ${theme.s2};
//     min-width: 110px;
//   }
// }

const Styled = styled.div`
  .BasicAnalysis-addOutput {
    font-size: 2rem;
    height: 100%;
    width: 2rem;

    box-shadow: ${theme.boxShadow1};
    border-radius: ${theme.br0};
    padding: ${theme.s2};
  }
`;