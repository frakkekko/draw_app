import { StyleSheet, Dimensions } from "react-native";

const inputModalStyles = StyleSheet.create({
  modalMainView: {
    width: Dimensions.get("window").width * 0.9,
    height: 250,
    backgroundColor: "#333",
    justifyContent: "space-around",
    alignItems: "center",
    alignSelf: "center",
    marginTop: 40,
    borderRadius: 10,
  },
  textModalHeader: { fontSize: 24, color: "#fff" },
  modalInputText: {
    color: "#fff",
    padding: 12,
    backgroundColor: "#555",
    borderRadius: 10,
    width: 200,
    fontSize: 18,
  },
  modalButtonsContainer: { flexDirection: "row", gap: 100 },
  modalButtonText: { fontSize: 20, color: "#fff" },
});

export default inputModalStyles;
