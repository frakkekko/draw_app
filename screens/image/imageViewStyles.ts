import { StyleSheet, Dimensions } from "react-native";

const imageViewStyles = StyleSheet.create({
  mainContainer: {
    flex: 1,
    position: "relative",
    justifyContent: "center",
    alignItems: "center",
  },
  image: { width: Dimensions.get("window").width },
  animatedTopView: {
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    padding: 20,
  },
  animatedTopViewWrapper: {
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    padding: 20,
    backgroundColor: "#222",
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
  },
  goBackButton: {
    position: "absolute",
    left: 20,
  },
  animatedBottomView: {
    position: "absolute",
    bottom: 0,
    left: 0,
    right: 0,
    padding: 20,
    justifyContent: "center",
    alignItems: "center",
  },
  buttonsBottomContainer: {
    position: "absolute",
    bottom: 0,
    left: 0,
    right: 0,
    padding: 20,
    justifyContent: "space-around",
    alignItems: "center",
    flexDirection: "row",
    backgroundColor: "#222",
  },
  titleText: { fontSize: 20, color: "#fff", textAlign: "center" },
});

export default imageViewStyles;
