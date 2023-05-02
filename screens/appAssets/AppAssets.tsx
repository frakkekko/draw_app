import React, { FunctionComponent, useEffect, useState, useRef } from "react";
import { Text, View, TouchableOpacity, Alert } from "react-native";

// File System
import * as FileSystem from "expo-file-system";

// Flash List
import { FlashList } from "@shopify/flash-list";

// Navigation
import type { NativeStackScreenProps } from "@react-navigation/native-stack";
import { RootStackParamList } from "../../App";

// Lodash
import { replace } from "lodash";

// Icons
import { Ionicons } from "@expo/vector-icons";

// Components
import InputModal from "../../components/functionalComponents/inputModal/InputModal";

// Gesture Handler
import {
  Swipeable,
  GestureHandlerRootView,
} from "react-native-gesture-handler";

// Redux
import { useDispatch, useSelector } from "react-redux";
import { AppDispatch, RootState } from "../../redux/store";
import {
  updateFolder,
  updateImage,
  updateImageByMerge,
} from "../../redux/foldersDuck/foldersDuck";

// Styles
import appAssetsStyles from "./appAssetsStyles";

type AppAssetsProps = NativeStackScreenProps<RootStackParamList, "AppAssets">;

const AppAssets: FunctionComponent<AppAssetsProps> = (
  props: AppAssetsProps
) => {
  let [modal, setModal] = useState<boolean>(false);

  let foldersState: string[] = useSelector(
    (state: RootState) => state.foldersDuck.folders
  );

  let dispatch: AppDispatch = useDispatch();

  let inputModalRef = useRef<string>("");

  useEffect(() => {
    readDirectory();
    // readImagesName();
  }, []);

  const handleDelete = (item: string) => async (): Promise<void> => {
    Alert.alert("Confirm", "Do you want to delete this album?", [
      {
        text: "Yes",
        onPress: async (): Promise<void> => {
          try {
            console.log("delete:", item);

            await FileSystem.deleteAsync(FileSystem.documentDirectory + item);
            const dirDataUpdate = foldersState.filter(
              (album) => item !== album
            );

            dispatch(updateImage({}));
            dispatch(updateFolder(dirDataUpdate));
          } catch (err) {
            console.log(err);
            Alert.alert(
              "Something went wrong",
              "An error occurred while deleting the album"
            );
          }
        },
      },
      {
        text: "No",
        onPress: (): void => console.log("No"),
      },
    ]);
  };

  const readDirectory = async (): Promise<void> => {
    try {
      let dirRead: string[] = await FileSystem.readDirectoryAsync(
        FileSystem.documentDirectory + ""
      );

      //await FileSystem.deleteAsync(FileSystem.documentDirectory + "mainAlbum");

      dirRead = dirRead.filter(
        (name) =>
          name !== "dev.expo.modules.core.logging.dev.expo.updates" &&
          name !== "RCTAsyncLocalStorage"
      );
      console.log(dirRead);

      dispatch(updateFolder(dirRead));
      // setDirData([...dirRead]);
    } catch (err) {
      console.log(err);
      Alert.alert(
        "Something went wrong",
        "An error occurred while getting the albums list"
      );
    }
  };

  const rightButton = (item: string) => () => {
    return (
      <View style={{ justifyContent: "center", alignItems: "center" }}>
        <TouchableOpacity style={{ padding: 10 }} onPress={handleDelete(item)}>
          <Ionicons name="ios-trash-outline" size={28} color="red" />
        </TouchableOpacity>
      </View>
    );
  };

  const goToAlbum =
    (album: string): (() => Promise<void>) =>
    async () => {
      try {
        // READ ONLY ARRAY
        const dirRead: ReadonlyArray<string> =
          await FileSystem.readDirectoryAsync(
            FileSystem.documentDirectory + album
          );

        const imagesStateUpdate: { [key: string]: string[] } = {};
        imagesStateUpdate[album] = [...dirRead];

        console.log("imageStateCopy:", imagesStateUpdate);
        dispatch(updateImageByMerge(imagesStateUpdate));

        props.navigation.navigate("Album", {
          albumName: album,
          headerTitle: replace(album, /_/g, " "),
        });
      } catch (err) {
        Alert.alert(
          "Something went wrong",
          "An error occurred while reading the album's images"
        );
      }
    };

  const renderItem = ({ item }: any): JSX.Element => {
    return (
      <TouchableOpacity
        style={{ height: 100, justifyContent: "center" }}
        onPress={goToAlbum(item)}
      >
        {item === "Main_Album" && (
          <Text
            style={{
              color: "#fff",
              fontSize: 24,
              padding: 20,
            }}
          >
            {replace(item, /_/g, " ")}
          </Text>
        )}
        {item !== "Main_Album" && (
          <Swipeable renderRightActions={rightButton(item)}>
            <Text
              style={{
                color: "#fff",
                fontSize: 24,
                padding: 20,
              }}
            >
              {replace(item, /_/g, " ")}
            </Text>
          </Swipeable>
        )}
      </TouchableOpacity>
    );
  };

  const addAlbum = (): void => {
    console.log("add album");

    setModal(true);
  };

  const handleModal = async (): Promise<void> => {
    try {
      if (foldersState.length >= 5)
        return Alert.alert("Full", "You cannot have more then 5 albums");

      let text: string = inputModalRef.current;
      if (text === "")
        return Alert.alert("Name error", "The name cannot be empty string");

      const regex: RegExp = /[\/\\:*?"<>|[\x00-\x1F\x7F_]/g;
      const isInvalidString: boolean = regex.test(text);

      if (isInvalidString)
        return Alert.alert(
          "Invalid Name",
          "The name contains invalid characters"
        );

      text = replace(text, /\s+/g, "_");

      const dirRead = await FileSystem.readDirectoryAsync(
        FileSystem.documentDirectory + ""
      );

      if (dirRead.includes(text)) return Alert.alert("Already Exist");

      await FileSystem.makeDirectoryAsync(FileSystem.documentDirectory + text);
      const dirDataUpdate: string[] = [...foldersState];
      dirDataUpdate.push(text);

      dispatch(updateFolder(dirDataUpdate));
      setModal(false);
    } catch (err) {
      console.log(err);
      Alert.alert(
        "Something went wrong",
        "An error occurred while reading the albums directory"
      );
    }
  };
  const handleInputModal = (text: string): void => {
    inputModalRef.current = text;
  };
  const closeModal = (): void => {
    setModal(false);
  };

  const extractKey = (item: string): string => {
    return item;
  };

  return (
    <View style={{ flex: 1 }}>
      <GestureHandlerRootView style={{ flex: 1 }}>
        {foldersState?.length > 0 && (
          <FlashList
            renderItem={renderItem}
            data={foldersState}
            estimatedItemSize={100}
            keyExtractor={extractKey}
          />
        )}
        <View style={appAssetsStyles.iconWrapper}>
          <TouchableOpacity
            style={appAssetsStyles.iconTouchable}
            onPress={addAlbum}
          >
            <Ionicons
              name="add"
              size={50}
              color="#fff"
              style={appAssetsStyles.icon}
            />
          </TouchableOpacity>
        </View>
        <InputModal
          closeModal={closeModal}
          handleInputModal={handleInputModal}
          handleModal={handleModal}
          modal={modal}
          label="Insert Album Name"
        />
      </GestureHandlerRootView>
    </View>
  );
};

export default AppAssets;
