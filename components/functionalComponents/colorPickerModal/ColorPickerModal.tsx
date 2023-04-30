import React, { FunctionComponent, useState, useEffect } from "react";
import {
  View,
  Text,
  Modal,
  Dimensions,
  TouchableOpacity,
  TouchableWithoutFeedback,
  Alert,
  Image,
  GestureResponderEvent,
} from "react-native";
import { FlashList } from "@shopify/flash-list";

// File System

import { ColorPicker } from "react-native-color-picker";

type ColorPickerModalProps = {
  modal: boolean;
  closeModal: Function;
  onColorSelected: Function;
};

const ColorPickerModal: FunctionComponent<ColorPickerModalProps> = (
  props: ColorPickerModalProps
) => {
  const closeModal = (): void => {
    props.closeModal();
  };

  const handleColorSelected = (color: string): void => {
    console.log("color selected:", color);
    props.onColorSelected(color);
  };

  return (
    <Modal
      visible={props.modal}
      style={{ flex: 1 }}
      animationType="slide"
      transparent
    >
      <View
        style={{
          height: Dimensions.get("window").height,
          width: Dimensions.get("window").width,
          justifyContent: "flex-end",
          alignItems: "center",
          zIndex: 4000,
        }}
      >
        <View
          style={{
            height: Dimensions.get("window").height * 0.85,
            width: Dimensions.get("window").width,
            backgroundColor: "#333",
            borderTopLeftRadius: 20,
            borderTopRightRadius: 20,
            position: "relative",
          }}
        >
          <TouchableOpacity
            style={{ position: "absolute", top: 20, left: 20, padding: 10 }}
            onPress={closeModal}
          >
            <Text
              style={{
                fontSize: 20,
                color: "#0066ff",
              }}
            >
              Close
            </Text>
          </TouchableOpacity>
          <Text
            style={{
              color: "#fff",
              fontSize: 26,
              padding: 30,
              textAlign: "center",
              zIndex: -1,
            }}
          >
            Color Picker
          </Text>
          <View
            style={{ flex: 1, justifyContent: "center", alignItems: "center" }}
          >
            <ColorPicker
              onColorSelected={handleColorSelected}
              style={{ width: 250, height: 400 }}
            />
          </View>
        </View>
      </View>
    </Modal>
  );
};

export default ColorPickerModal;
