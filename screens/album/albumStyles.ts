import { StyleSheet, Dimensions } from "react-native";

const albumStyles = StyleSheet.create({
  listContainer: {
    flex: 1,
  },
  img: {
    width: Dimensions.get("window").width,
    // aspectRatio: 1,
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
