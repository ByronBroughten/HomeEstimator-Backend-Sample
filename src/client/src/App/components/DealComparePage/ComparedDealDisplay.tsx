import { Box, SxProps } from "@mui/material";
import { Text, View } from "react-native";
import { useGetterSectionOnlyOne } from "../../stateClassHooks/useGetterSection";
import { nativeTheme } from "../../theme/nativeTheme";
import { arrSx } from "../../utils/mui";
import { icons } from "../Icons";
import { MuiRow } from "../general/MuiRow";

type Props = {
  feId: string;
  sx?: SxProps;
};
export function ComparedDealDisplay({ feId, sx }: Props) {
  const menu = useGetterSectionOnlyOne("dealCompareMenu");
  const cache = useGetterSectionOnlyOne("dealCompareCache");

  const dealSystem = cache.child({ childName: "comparedDealSystem", feId });
  const outputList = menu.onlyChild("outputList");
  const compareValues = outputList.children("outputItem");
  const deal = dealSystem.onlyChild("deal");
  const displayName = deal.valueNext("displayName").mainText;
  return (
    <Box
      sx={[
        {
          ...nativeTheme.subSection.borderLines,
          minWidth: nativeTheme.comparedDeal.width,
          minHeight: 400,
          padding: nativeTheme.s4,
          paddingBottom: 0,
          borderRadius: nativeTheme.br0,
          boxShadow: nativeTheme.oldShadow1,
        },
        ...arrSx(sx),
      ]}
    >
      <Box sx={{ height: 85 }}>
        {/* <Box
          sx={{
            display: "flex"
            flex: 1,
            paddingTop: nativeTheme.s3,
            paddingBottom: nativeTheme.s25,
            alignItems: "center",
            justifyContent: "flex-start",
            maxWidth: 200,
          }}
        > */}
        <MuiRow
          sx={{
            alignItems: "flex-start",
            flexWrap: "nowrap",
            maxWidth: 200,
          }}
        >
          {icons[deal.valueNext("dealMode")]({
            size: 25,
            style: {
              marginLeft: nativeTheme.s2,
              color: nativeTheme.darkBlue.main,
            },
          })}
          <MuiRow
            sx={{
              marginLeft: nativeTheme.s4,
              flex: 1,
            }}
          >
            <Box
              sx={{
                fontSize: nativeTheme.fs20,
                color: nativeTheme.primary.main,
                paddingRight: nativeTheme.s3,
                ...(!displayName && {
                  fontStyle: "italic",
                }),
              }}
            >
              {displayName || "Untitled"}
            </Box>
          </MuiRow>
        </MuiRow>
        {/* </Box> */}
      </Box>
      {compareValues.map((compareValue) => {
        const info = compareValue.valueEntityInfo();
        const varb = dealSystem.varbByFocalMixed(info);
        return (
          <View
            key={compareValue.feId}
            style={{
              height: nativeTheme.comparedDealValue.height,
              padding: nativeTheme.s2,
              paddingTop: nativeTheme.s4,
              paddingBottom: nativeTheme.s4,
              ...nativeTheme.formSection,
            }}
          >
            <View style={{ alignItems: "center" }}>
              <Text
                numberOfLines={1}
                style={{ color: nativeTheme.primary.main, fontSize: 16 }}
              >
                {varb.inputLabel}
              </Text>
            </View>
            <View style={{ alignItems: "center" }}>
              <Text numberOfLines={1} style={{ fontSize: 16 }}>
                {varb.displayValue === "N/A" ? "N/A" : varb.displayVarb()}
              </Text>
            </View>
          </View>
        );
      })}
    </Box>
  );
}
