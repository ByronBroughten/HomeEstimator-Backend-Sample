import { useGetterSection } from "../../../sharedWithServer/stateClassHooks/useGetterSection";
import { ValueOngoingSection } from "../ValueOngoingSection";
import { ValueGroupGeneric } from "./ListGroupShared/ValueGroupGeneric";

type Props = {
  feId: string;
  titleText: string;
  className?: string;
  extraValueChildren?: React.ReactNode;
};

export function ValueGroupOngoing({ feId, ...props }: Props) {
  const valueGroup = useGetterSection({
    sectionName: "ongoingValueGroup",
    feId,
  });
  const totalVarbName = valueGroup.switchVarbName(
    "total",
    "ongoing"
  ) as "totalMonthly";
  return (
    <ValueGroupGeneric
      {...{
        ...props,
        valueParentInfo: {
          sectionName: "ongoingValueGroup",
          feId,
        } as const,
        valueAsChildName: "ongoingValue",
        totalVarbName,
        makeValueNode: (nodeProps) => <ValueOngoingSection {...nodeProps} />,
      }}
    />
  );
}
