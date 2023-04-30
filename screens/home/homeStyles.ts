import { StyleSheet, Dimensions } from "react-native";

const homeStyles = StyleSheet.create({
  textHeader: {
    fontSize: 40,
    color: "#fff",
    textAlign: "center",
    marginTop: 60,
  },
  buttonsContainer: {
    position: "absolute",
    flexDirection: "row",
    height: 150,
    bottom: 0,
    left: 0,
    right: 0,
    backgroundColor: "#222",
    justifyContent: "space-around",
    alignItems: "center",
  },
  buttonText: { fontSize: 26, color: "#fff" },
});

export default homeStyles;
