import { FeVarbInfo } from "../../../../../../sharedWithServer/SectionInfos/FeInfo";
import { useGetterVarb } from "../../../../../stateClassHooks/useGetterVarb";

type Props = { varbInfo: FeVarbInfo };
export function ListGroupTotal({ varbInfo }: Props) {
  const varb = useGetterVarb(varbInfo);
  return <div className="ListGroup-totalText">{varb.displayVarb()}</div>;
}
