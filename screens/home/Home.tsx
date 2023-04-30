import React, { FunctionComponent, useEffect, useRef, useState } from "react";
import { Text, View, TouchableOpacity, Alert } from "react-native";

// Navigation
import { RootStackParamList } from "../../App";
import type { NativeStackScreenProps } from "@react-navigation/native-stack";

// File System
import * as FileSystem from "expo-file-system";

// Styles
import homeStyles from "./homeStyles";

// Lodash
import { replace } from "lodash";

// Components
import InputModal from "../../components/functionalComponents/inputModal/InputModal";
import TutorialModal from "../../components/functionalComponents/tutorialModal/TutorialModal";

// Local Storage
import AsyncStorage from "@react-native-async-storage/async-storage";

type HomeProps = NativeStackScreenProps<RootStackParamList, "Home">;

const Home: FunctionComponent<HomeProps> = (props: HomeProps) => {
  let [modal, setModal] = useState<boolean>(false);
  let [tutorialModal, setTutorialModal] = useState<boolean>(false);
  let inputModalRef = useRef<string>("");

  useEffect(() => {
    // clearLocalStorage();
    // readDirTest();
    checkTutorial();
    // clearStorage();
  }, []);

  const clearStorage = async (): Promise<void> => {
    await AsyncStorage.removeItem("tutorial");
  };

  const checkTutorial = async (): Promise<void> => {
    const tutorialDone = await AsyncStorage.getItem("tutorial");
    if (tutorialDone) return;

    setTutorialModal(true);
  };

  const goToAssets = () => {
    props.navigation.navigate("AppAssets");
  };

  const openModal = (): void => {
    setModal(true);
  };

  const closeModal = (): void => {
    setModal(false);
  };
  const handleModal = async (): Promise<void> => {
    try {
      let text: string = inputModalRef.current;
      if (text === "" || /^\s*$/.test(text))
        return Alert.alert("Name error", "The name cannot be empty string");

      const regex: RegExp = /[\/\\:*?"<>|[\x00-\x1F\x7F_]/g;
      const isInvalidString: boolean = regex.test(text);

      if (isInvalidString)
        return Alert.alert(
          "Invalid Name",
          "The name contains invalid characters"
        );

      text = replace(text, /\s+/g, "_");
      const dirInfo: FileSystem.FileInfo = await FileSystem.getInfoAsync(
        FileSystem.documentDirectory + "Main_Album"
      );

      if (dirInfo.exists) {
        const dirRead: string[] = await FileSystem.readDirectoryAsync(
          FileSystem.documentDirectory + "Main_Album"
        );

        if (dirRead.includes(text + ".png")) {
          return Alert.alert("Already exists", "This file name already exists");
        }
      }

      props.navigation.navigate("Draw", { drawName: text });
      closeModal();
    } catch (err) {
      console.log(err);
      Alert.alert(
        "Something went wrong",
        "An error occurred while reading the Main Album directory"
      );
    }
  };

  const handleInputModal = (text: string): void => {
    inputModalRef.current = text;
  };

  const handleTutorialDone = async (): Promise<void> => {
    console.log("tutorial done");

    await AsyncStorage.setItem("tutorial", "true");
    setTutorialModal(false);
  };

  return (
    <View style={{ flex: 1 }}>
      <Text style={homeStyles.textHeader}>Draw App</Text>
      <View style={homeStyles.buttonsContainer}>
        <View>
          <TouchableOpacity onPress={goToAssets}>
            <Text style={homeStyles.buttonText}>Assets</Text>
          </TouchableOpacity>
        </View>
        <View>
          <TouchableOpacity onPress={openModal}>
            <Text style={homeStyles.buttonText}>Draw</Text>
          </TouchableOpacity>
        </View>
      </View>
      <TutorialModal
        handleTutorialDone={handleTutorialDone}
        isShown={tutorialModal}
      />
      <InputModal
        handleInputModal={handleInputModal}
        handleModal={handleModal}
        closeModal={closeModal}
        modal={modal}
        label="Insert Draw Name"
      />
    </View>
  );
};

export default Home;
