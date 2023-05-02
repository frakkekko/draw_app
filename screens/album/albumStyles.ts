import { StyleSheet, Dimensions } from "react-native";

const albumStyles = StyleSheet.create({
  listContainer: {
    flex: 1,
  },
  searchBarContainer: {
    height: 80,
    width: "100%",
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#111",
  },
  addImageBtnContainer: {
    position: "absolute",
    justifyContent: "center",
    alignItems: "center",
    width: 80,
    height: 80,
    bottom: 80,
    right: 40,
  },
  addImageTouchable: {
    backgroundColor: "#1e90ff",
    justifyContent: "center",
    alignItems: "center",
    borderRadius: 50,
    width: 70,
    height: 70,
    shadowColor: "#000000",
    shadowOffset: {
      width: 0,
      height: 7,
    },
    shadowOpacity: 0.21,
    shadowRadius: 7.68,
    elevation: 10,
  },
  addButtonIcon: { justifyContent: "center", alignItems: "center" },
  img: {
    width: Dimensions.get("window").width,
    height: 400,
    marginTop: 10,
  },
  imgContainer: { width: Dimensions.get("window").width, position: "relative" },
  labelContainer: { position: "absolute", bottom: 20, left: 20 },
  textLabel: {
    fontSize: 18,
    textShadowColor: "rgba(0, 0, 0, 0.4)",
    textShadowOffset: { width: -2, height: 2 },
    textShadowRadius: 4,
  },
});

export default albumStyles;
