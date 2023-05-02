import { StyleSheet } from "react-native";

const appAssetsStyles = StyleSheet.create({
  iconWrapper: {
    position: "absolute",
    justifyContent: "center",
    alignItems: "center",
    width: 80,
    height: 80,
    bottom: 80,
    right: 40,
  },
  iconTouchable: {
    backgroundColor: "#1e90ff",
    justifyContent: "center",
    alignItems: "center",
    borderRadius: 50,
    width: 70,
    height: 70,
  },
  icon: { justifyContent: "center", alignItems: "center" },
});

export default appAssetsStyles;
