import React, { FunctionComponent } from "react";
import { View, Text, Modal, TextInput, TouchableOpacity } from "react-native";

// Styles
import inputModalStyles from "./inputModalStyles";

// Safe Area
import { useSafeAreaInsets } from "react-native-safe-area-context";

type InputModalProps = {
  handleInputModal: Function;
  handleModal: Function;
  closeModal: Function;
  modal: boolean;
  label: string;
};

const InputModal: FunctionComponent<InputModalProps> = (
  props: InputModalProps
) => {
  const insets = useSafeAreaInsets();

  const handleInputModal = (text: string): void => {
    props.handleInputModal(text);
  };
  const handleModal = () => {
    props.handleModal();
  };
  const closeModal = () => {
    props.closeModal();
  };

  return (
    <Modal
      visible={props.modal}
      style={{ flex: 1 }}
      animationType="slide"
      transparent
    >
      <View
        style={[inputModalStyles.modalMainView, { marginTop: 40 + insets.top }]}
      >
        <Text style={inputModalStyles.textModalHeader}>{props.label}</Text>
        <TextInput
          onChangeText={handleInputModal}
          style={inputModalStyles.modalInputText}
        />

        <View style={inputModalStyles.modalButtonsContainer}>
          <TouchableOpacity onPress={closeModal}>
            <Text style={inputModalStyles.modalButtonText}>Undo</Text>
          </TouchableOpacity>
          <TouchableOpacity onPress={handleModal}>
            <Text style={inputModalStyles.modalButtonText}>Ok</Text>
          </TouchableOpacity>
        </View>
      </View>
    </Modal>
  );
};

export default InputModal;
