import { StyleSheet } from "react-native";

const paletteStyles = StyleSheet.create({
  mainView: {
    padding: 10,
    zIndex: 10,
  },
  subViewWrapper: {
    justifyContent: "space-around",
    alignItems: "center",
    gap: 40,
  },
  subView: { position: "relative" },
  paletteText: { fontSize: 20, color: "#fff" },
  asideView: {
    position: "absolute",
    top: -20,
    right: -250,
    width: 220,
    height: 60,
    flexDirection: "row",
    justifyContent: "space-around",
    alignItems: "center",
    zIndex: 20,
  },
  itemPicker: { width: 35, height: 35, borderRadius: 50 },
});

export default paletteStyles;
