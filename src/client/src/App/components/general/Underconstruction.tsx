import { Text, View } from "react-native";
import { nativeTheme } from "../../theme/nativeTheme";

export function UnderConstruction() {
  return (
    <View
      style={{
        flex: 1,
        padding: nativeTheme.s5,
        justifyContent: "center",
      }}
    >
      <Text style={{ fontSize: 30, color: nativeTheme.primary.main }}>
        Under Construction
      </Text>
    </View>
  );
}
