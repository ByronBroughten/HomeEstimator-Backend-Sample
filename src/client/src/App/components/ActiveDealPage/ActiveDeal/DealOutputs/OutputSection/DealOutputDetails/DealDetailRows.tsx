import { isEqual } from "lodash";
import styled from "styled-components";
import { FeVarbInfo } from "../../../../../../sharedWithServer/SectionsMeta/SectionInfo/FeInfo";
import { useSetterVarb } from "../../../../../../sharedWithServer/stateClassHooks/useSetterVarb";
import { SetterVarb } from "../../../../../../sharedWithServer/StateSetters/SetterVarb";
import {
  DealDetailRowVarbFound,
  DealDetailRowVarbNotFound,
} from "./DealDetailRow";

function skipVarbIfDuplicate(varb: SetterVarb): SetterVarb {
  let count = 0;
  let isGoing = true;
  while (isGoing) {
    isGoing = false;
    const { activeMixedInfos } = varb.inEntity;
    if (activeMixedInfos.length === 1) {
      const inInfo = activeMixedInfos[0];
      const { setterSections } = varb;
      const { section } = varb.get;
      if (section.hasVarbByFocalMixed(inInfo)) {
        const { feVarbInfo } = section.varbByFocalMixed(inInfo);
        const inVarb = setterSections.varb(feVarbInfo);
        if (
          isEqual(
            varb.get.numberOrQuestionMark,
            inVarb.get.numberOrQuestionMark
          )
        ) {
          varb = inVarb;
          isGoing = true;
        }
      }
    }
    count++;
    if (count === 100) {
      throw new Error(`While loop exceeded limit with ${varb.get.varbId}`);
    }
  }
  return varb;
}

export function DealDetailRowsNext({
  varbInfo,
  level,
}: {
  varbInfo: FeVarbInfo;
  level: number;
}) {
  level = level + 1;
  const varb = useSetterVarb(varbInfo);
  const { setterSections } = varb;
  const { section } = varb.get;
  return (
    <Styled className="DealDetailRows-root">
      {varb.inEntity.activeMixedInfos.map((inInfo) => {
        if (section.hasVarbByFocalMixed(inInfo)) {
          const { feVarbInfo } = section.varbByFocalMixed(inInfo);
          let inVarb = setterSections.varb(feVarbInfo);
          if (inVarb.meta.valueName === "numObj") {
            inVarb = skipVarbIfDuplicate(inVarb);
            return (
              <DealDetailRowVarbFound
                {...{
                  varbInfo: inVarb.get.feVarbInfo,
                  level,
                  key: inVarb.get.varbId,
                }}
              />
            );
          } else return null;
        } else {
          if (!("entityId" in inInfo)) {
            throw new Error(
              `Only entities should be missing here, not relative varb infos.`
            );
          }
          return (
            <DealDetailRowVarbNotFound
              {...{
                varbInfo,
                level,
                entityId: inInfo.entityId,
                key: inInfo.entityId,
              }}
            />
          );
        }
      })}
    </Styled>
  );
}

const Styled = styled.div``;
