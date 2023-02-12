import { BsCloudArrowDown } from "react-icons/bs";
import { useToggleView } from "../../../../../modules/customHooks/useToggleView";
import { FeSectionInfo } from "../../../../../sharedWithServer/SectionsMeta/SectionInfo/FeInfo";
import { SectionNameByType } from "../../../../../sharedWithServer/SectionsMeta/SectionNameByType";
import { LabeledIconBtn } from "../../../LabeledIconBtn";
import { ModalSection } from "../../../ModalSection";
import { SectionIndexRows } from "../../../SectionIndexRows";

type Props<SN extends SectionNameByType<"hasIndexStore">> = {
  loadWhat: string;
  feInfo: FeSectionInfo<SN>;
  loadMode: "load" | "loadAndCopy";
  className?: string;
  onLoad?: () => void;
};
export function ActionMenuLoadBtn<
  SN extends SectionNameByType<"hasIndexStore">
>({ loadWhat, feInfo, loadMode, className, onLoad }: Props<SN>) {
  const { modalIsOpen, openModal, closeModal } = useToggleView("modal", false);
  return (
    <>
      <LabeledIconBtn
        key="load"
        label="Load"
        icon={<BsCloudArrowDown size={26} />}
        onClick={openModal}
        className={`ActionMenuLoadBtn-root ${className ?? ""}`}
      />
      <ModalSection
        closeModal={closeModal}
        show={modalIsOpen}
        title={`Load ${loadWhat}`}
      >
        <SectionIndexRows
          {...{
            feInfo,
            onClick: () => {
              closeModal();
              onLoad && onLoad();
            },
            loadMode,
          }}
        />
      </ModalSection>
    </>
  );
}
