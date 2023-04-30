import React, { FunctionComponent, useState, useRef, useEffect } from "react";
import {
  View,
  Text,
  Image,
  Dimensions,
  TouchableWithoutFeedback,
  TouchableOpacity,
  Animated,
  Alert,
  ScrollView,
  FlatList,
} from "react-native";

// Navigation
import type { NativeStackScreenProps } from "@react-navigation/native-stack";
import { RootStackParamList } from "../../App";

// File System
import * as FileSystem from "expo-file-system";

// Media Library
import * as MediaLibrary from "expo-media-library";

// Safe area context
import { useSafeAreaInsets } from "react-native-safe-area-context";

// Icons
import { Ionicons } from "@expo/vector-icons";

// Lodash
import { cloneDeep, replace } from "lodash";

// Blur View
import { BlurView } from "expo-blur";

// Redux
import { useDispatch, useSelector } from "react-redux";
import { RootState, AppDispatch } from "../../redux/store";
import { updateImage } from "../../redux/foldersDuck/foldersDuck";

type ImageProps = NativeStackScreenProps<RootStackParamList, "ImageView">;

const ImageView: FunctionComponent<ImageProps> = (props: ImageProps) => {
  let insets = useSafeAreaInsets();
  let [showInfo, setShowInfo] = useState<boolean>(false);

  let imagesState = useSelector((state: RootState) => state.foldersDuck.images);
  let dispatch: AppDispatch = useDispatch();

  const fadeAnim: Animated.Value = useRef<Animated.Value>(
    new Animated.Value(0)
  ).current; // Initial value for opacity: 0

  useEffect(() => {
    Animated.timing(fadeAnim, {
      toValue: showInfo ? 1 : 0,
      duration: 200,
      useNativeDriver: true,
    }).start(() => console.log("Animation Completed"));
  }, [showInfo]);

  const toggleInfo = (): void => {
    setShowInfo(!showInfo);
  };

  const saveToMediaLibrary = async (): Promise<void> => {
    try {
      const permission: MediaLibrary.PermissionResponse =
        await MediaLibrary.requestPermissionsAsync();
      if (permission.status !== "granted")
        return Alert.alert(
          "Permission denied",
          "Permission for access to Media Library denied"
        );

      await MediaLibrary.saveToLibraryAsync(
        `${FileSystem.documentDirectory}${props.route.params.albumName}/${props.route.params.img}`
      );

      Alert.alert("Saved", "The image has been saved in Media Library");
    } catch (err) {
      console.log(err);
      Alert.alert(
        "Something went wrong",
        "An error occurred while saving in Media Library"
      );
    }
  };

  const saveToMainAlbum = async (): Promise<void> => {
    try {
      const mainAlbumDir: string[] = await FileSystem.readDirectoryAsync(
        FileSystem.documentDirectory + "Main_Album"
      );

      if (mainAlbumDir.includes(props.route.params.img))
        return Alert.alert(
          "Already present",
          "This image is already present in Main Album"
        );

      await FileSystem.copyAsync({
        from: `${FileSystem.documentDirectory}${props.route.params.albumName}/${props.route.params.img}`,
        to: `${FileSystem.documentDirectory}/Main_Album/${props.route.params.img}`,
      });

      Alert.alert("Success", "Image copied in Main Album");
    } catch (err) {
      console.log(err);
      Alert.alert("Something went wrong", "Error occurred moving the file");
    }
  };

  const deleteItem = async (): Promise<void> => {
    Alert.alert("Confirm", "Are you sure?", [
      {
        text: "Yes",
        onPress: async (): Promise<void> => {
          try {
            await FileSystem.deleteAsync(
              FileSystem.documentDirectory +
                `${props.route.params.albumName}/` +
                props.route.params.img
            );

            const imagesStateCopy: { [key: string]: string[] } =
              cloneDeep(imagesState);
            const updateImagesData: string[] = imagesStateCopy[
              props.route.params.albumName
            ].filter((img) => img !== props.route.params.img);

            imagesStateCopy[props.route.params.albumName] = [
              ...updateImagesData,
            ];

            console.log("updateD", updateImagesData);
            console.log("newStateToUpdate", imagesStateCopy);

            dispatch(updateImage(imagesStateCopy));
            props.navigation.goBack();
          } catch (err) {
            console.log(err);
            Alert.alert(
              "Something went wrong",
              "An error occurred while deleting the image"
            );
          }
        },
      },
      {
        text: "No",
        onPress: (): void => {
          console.log("No");
        },
      },
    ]);
  };

  return (
    <View
      style={{
        flex: 1,
        position: "relative",
        justifyContent: "center",
        alignItems: "center",
        paddingTop: insets.top,
        paddingBottom: insets.bottom,
      }}
    >
      <TouchableWithoutFeedback onPress={toggleInfo}>
        <Image
          style={{
            width: Dimensions.get("window").width,
            height:
              Dimensions.get("window").height - insets.top - insets.bottom,
          }}
          source={{
            uri:
              FileSystem.documentDirectory +
              `${props.route.params.albumName}/` +
              props.route.params.img,
          }}
        />
      </TouchableWithoutFeedback>

      {
        <>
          <Animated.View
            style={{
              position: "absolute",
              top: 0,
              left: 0,
              right: 0,
              padding: 20,
              paddingTop: 10 + insets.top,
              opacity: fadeAnim,
            }}
          >
            <View
              style={{
                position: "absolute",
                top: 0,
                left: 0,
                right: 0,
                padding: 20,
                paddingTop: 10 + insets.top,
                backgroundColor: "#222",
              }}
            >
              <Text
                style={{ fontSize: 20, color: "#fff", textAlign: "center" }}
              >
                {replace(props.route.params.img.slice(0, -4), /_/g, " ")}
              </Text>
            </View>
          </Animated.View>
          <Animated.View
            style={{
              position: "absolute",
              bottom: 0,
              left: 0,
              right: 0,
              padding: 20,
              paddingBottom: 10 + insets.bottom,
              justifyContent: "center",
              alignItems: "center",
              opacity: fadeAnim,
            }}
          >
            <View
              style={{
                position: "absolute",
                bottom: 0,
                left: 0,
                right: 0,
                padding: 20,
                paddingBottom: 10 + insets.bottom,
                justifyContent: "space-around",
                alignItems: "center",
                flexDirection: "row",
                backgroundColor: "#222",
              }}
            >
              <TouchableOpacity onPress={saveToMediaLibrary}>
                <Ionicons name="download-outline" size={34} color="#0066ff" />
              </TouchableOpacity>
              {props.route.params.albumName !== "Main_Album" && (
                <TouchableOpacity onPress={saveToMainAlbum}>
                  <Ionicons name="albums-outline" size={34} color="#0066ff" />
                </TouchableOpacity>
              )}
              <TouchableOpacity onPress={deleteItem}>
                <Ionicons name="ios-trash-outline" size={34} color="red" />
              </TouchableOpacity>
            </View>
          </Animated.View>
        </>
      }
    </View>
  );
};

export default ImageView;
