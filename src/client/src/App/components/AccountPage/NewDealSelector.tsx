import { Box } from "@mui/material";
import { ClipLoader } from "react-spinners";
import { dealModeLabels } from "../../sharedWithServer/SectionsMeta/values/StateValue/unionValues";
import { useActionNoSave } from "../../sharedWithServer/stateClassHooks/useAction";
import { useGetterFeStore } from "../../sharedWithServer/stateClassHooks/useFeStore";
import { useGetterSectionOnlyOne } from "../../sharedWithServer/stateClassHooks/useGetterSection";
import { nativeTheme } from "../../theme/nativeTheme";
import { HollowBtn } from "../appWide/HollowBtn";
import { MuiSelect } from "../appWide/MuiSelect";
import { VarbStringLabel } from "../appWide/VarbStringLabel";

type Props = { closeSelector: () => void };
export function NewDealSelector(props: Props) {
  const { labSubscription } = useGetterFeStore();
  return <NewDealSelectorAddDeal {...props} />;
}

function NewDealSelectorAddDeal({ closeSelector }: Props) {
  const updateValue = useActionNoSave("updateValue");
  const setCreatingDeal = () =>
    updateValue({
      ...session.varbInfo("isCreatingDeal"),
      value: true,
    });

  const session = useGetterSectionOnlyOne("sessionStore");
  const isCreatingDeal = session.valueNext("isCreatingDeal");

  const newDealMenu = useGetterSectionOnlyOne("newDealMenu");
  return (
    <Box>
      <MuiSelect
        {...{
          sx: { width: "100%", mt: nativeTheme.s3 },
          selectProps: { sx: { width: "100%" } },
          label: (
            <VarbStringLabel
              {...{ names: { sectionName: "deal", varbName: "dealMode" } }}
            />
          ),
          unionValueName: "dealMode",
          feVarbInfo: {
            ...newDealMenu.feInfo,
            varbName: "dealMode",
          },
          items: [
            ["homeBuyer", dealModeLabels.homeBuyer],
            ["buyAndHold", dealModeLabels.buyAndHold],
            ["fixAndFlip", dealModeLabels.fixAndFlip],
            ["brrrr", dealModeLabels.brrrr],
          ],
        }}
      />
      {isCreatingDeal && (
        <ClipLoader
          {...{
            loading: true,
            color: nativeTheme.light,
            size: 25,
          }}
        />
      )}
      {!isCreatingDeal && (
        <HollowBtn
          sx={{
            mt: nativeTheme.s4,
            width: "100%",
            height: "50px",
            fontSize: nativeTheme.fs20,
          }}
          middle={"Create Deal"}
          onClick={setCreatingDeal}

          // {...{
          //   ...(!isCreatingDeal
          //     ? { middle: "Create Deal", onClick: setCreatingDeal }
          //     : {
          //         middle: (
          //           <ClipLoader
          //             {...{
          //               loading: isCreatingDeal,
          //               color: nativeTheme.light,
          //               size: 25,
          //             }}
          //           />
          //         ),
          //       }),
          // }}
        />
      )}
    </Box>
  );
}

function NewDealSelectorUpgradeToPro() {}
