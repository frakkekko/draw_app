import React, {
  FunctionComponent,
  MutableRefObject,
  useEffect,
  useRef,
  useState,
  useTransition,
} from "react";
import {
  View,
  Text,
  TextInput,
  Image,
  Dimensions,
  TouchableOpacity,
  TouchableWithoutFeedback,
  GestureResponderEvent,
  Alert,
  FlatList,
  Keyboard,
} from "react-native";

// Flash List
import { FlashList, ListRenderItem } from "@shopify/flash-list";

// File System
import * as FileSystem from "expo-file-system";

// Styles
import albumStyles from "./albumStyles";

// Navigation
import type { NativeStackScreenProps } from "@react-navigation/native-stack";
import { RootStackParamList } from "../../App";

// Lodash
import { cloneDeep, replace } from "lodash";

// Icons
import { Ionicons } from "@expo/vector-icons";

// Gestures
import {
  Swipeable,
  GestureHandlerRootView,
} from "react-native-gesture-handler";
import ImagePickerModal from "../../components/functionalComponents/imagePickerModal/ImagePickerModal";

// Redux
import { useSelector, useDispatch } from "react-redux";
import { RootState, AppDispatch } from "../../redux/store";
import { updateImage } from "../../redux/foldersDuck/foldersDuck";

// Components
import SearchBar from "../../components/functionalComponents/searchBar/SearchBar";

type AlbumProps = NativeStackScreenProps<RootStackParamList, "Album">;

const Album: FunctionComponent<AlbumProps> = (props: AlbumProps) => {
  let imagesState: any = useSelector(
    (state: RootState) => state.foldersDuck.images
  );

  let [modal, setModal] = useState<boolean>(false);
  let [dataToFilter, setDataToFilter] = useState<string[]>([
    ...imagesState[props.route.params.albumName],
  ]);
  let [isActiveFilter, setIsActiveFilter] = useState<boolean>(false);

  let inputRef = useRef<TextInput>();

  useEffect(() => {
    const unsubscribe = props.navigation.addListener("blur", () => {
      console.log("Screen blurred");
      setIsActiveFilter(false);
      inputRef.current?.clear();
    });

    return unsubscribe;
  }, [props.navigation]);

  useEffect(() => {
    console.log("goBack test");
  }, [props.navigation]);

  let dispatch: AppDispatch = useDispatch();

  const handleDelete =
    (item: string): ((e: GestureResponderEvent) => Promise<void>) =>
    async () => {
      Alert.alert("Confirm", "Do you want to delete this image?", [
        {
          text: "Yes",
          onPress: async (): Promise<void> => {
            try {
              console.log(
                "item to delete:",
                FileSystem.documentDirectory +
                  `${props.route.params.albumName}/` +
                  item
              );

              await FileSystem.deleteAsync(
                FileSystem.documentDirectory +
                  `${props.route.params.albumName}/` +
                  item
              );

              const imgsUpdate = imagesState[
                props.route.params.albumName
              ].filter((img: string) => img !== item);

              const imgsStateUpdate = cloneDeep(imagesState);
              imgsStateUpdate[props.route.params.albumName] = [...imgsUpdate];
              dispatch(updateImage(imgsStateUpdate));
              const dataToFilterUpdate = dataToFilter.filter(
                (img: string) => img !== item
              );
              setDataToFilter([...dataToFilterUpdate]);

              // setImgs([...imgsUpdate]);
            } catch (err) {
              console.log(err);
              Alert.alert(
                "Something went wrong",
                "An error occurred while deleting the file"
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

  const goToImageView =
    (item: string): ((e: GestureResponderEvent) => void) =>
    () => {
      props.navigation.navigate("ImageView", {
        img: item,
        albumName: props.route.params.albumName,
      });
    };

  const rightButton =
    (item: string): any =>
    () => {
      return (
        <View style={{ justifyContent: "center", alignItems: "center" }}>
          <TouchableOpacity
            style={{ padding: 30 }}
            onPress={handleDelete(item)}
          >
            <Ionicons name="ios-trash-outline" size={34} color="red" />
          </TouchableOpacity>
        </View>
      );
    };

  const extractKey = (name: string, index: number): string => {
    return index + "-" + name;
  };

  const renderItem = ({ item }: any): JSX.Element => {
    console.log("Render: ", item);
    return (
      <GestureHandlerRootView>
        <Swipeable friction={2} renderRightActions={rightButton(item)}>
          <TouchableWithoutFeedback
            style={albumStyles.imgContainer}
            onPress={goToImageView(item)}
          >
            <Image
              style={albumStyles.img}
              source={{
                uri:
                  FileSystem.documentDirectory +
                  `${props.route.params.albumName}/` +
                  item,
              }}
            />
          </TouchableWithoutFeedback>
          <View style={albumStyles.labelContainer}>
            <Text style={albumStyles.textLabel}>
              {replace(item.slice(0, -4), /_/g, " ")}
            </Text>
          </View>
        </Swipeable>
      </GestureHandlerRootView>
    );
  };

  const closeModal = (): void => {
    setModal(false);
  };

  const openModal = async (): Promise<void> => {
    try {
      const dirInfo = await FileSystem.getInfoAsync(
        FileSystem.documentDirectory + "Main_Album"
      );

      if (!dirInfo.exists)
        return Alert.alert(
          "Directory does not exist",
          "You have not saved any drawings yet"
        );

      const dataRead = await FileSystem.readDirectoryAsync(
        FileSystem.documentDirectory + "Main_Album"
      );

      if (dataRead.length === 0)
        return Alert.alert(
          "Directory does not exist",
          "You have not saved any drawings yet"
        );

      const imagesStateCopy = cloneDeep(imagesState);
      imagesStateCopy["Main_Album"] = [...dataRead];
      dispatch(updateImage(imagesStateCopy));
      // setDataRead([...dataRead]);
      setModal(true);
    } catch (err) {
      console.log(err);
      Alert.alert(
        "Something went wrong",
        "An error occurred while getting/reading the directory"
      );
    }
  };

  const addImgToAlbum = async (item: string): Promise<void> => {
    try {
      console.log(item);
      console.log(imagesState);

      if (imagesState[props.route.params.albumName].includes(item))
        return Alert.alert("Image already added");

      await FileSystem.copyAsync({
        from: `${FileSystem.documentDirectory}Main_Album/${item}`,
        to: `${FileSystem.documentDirectory}${props.route.params.albumName}/${item}`,
      });

      const imgsUpdate = [...imagesState[props.route.params.albumName]];
      imgsUpdate.push(item);

      const imgsStateUpdate = cloneDeep(imagesState);
      imgsStateUpdate[props.route.params.albumName] = [...imgsUpdate];

      dispatch(updateImage(imgsStateUpdate));
      setIsActiveFilter(false);

      inputRef.current?.clear();

      // setImgs([...imgsUpdate]);
      setModal(false);
    } catch (err) {
      console.log(err);
      Alert.alert(
        "Something went wrong",
        "There was an error inserting the image into the current album"
      );
    }
  };

  const updateFilter = (str: string): void => {
    const updateFilter = imagesState[props.route.params.albumName].filter(
      (imageName: string) => {
        str = replace(str, /\s+/g, "_");
        return imageName.toLowerCase().includes(str.toLowerCase());
      }
    );

    console.log(dataToFilter);

    if (str === "") return setIsActiveFilter(false);

    setIsActiveFilter(true);
    setDataToFilter([...updateFilter]);
    console.log(str);
  };

  return (
    <View style={{ flex: 1 }}>
      <View
        style={{
          height: 80,
          width: "100%",
          justifyContent: "center",
          alignItems: "center",
          backgroundColor: "#111",
        }}
      >
        <SearchBar onInputChange={updateFilter} inputRef={inputRef} />
      </View>
      <View style={albumStyles.listContainer}>
        <FlatList
          data={
            isActiveFilter
              ? dataToFilter
              : imagesState[props.route.params.albumName]
          }
          renderItem={renderItem}
          // estimatedItemSize={Dimensions.get("window").width}
          keyExtractor={extractKey}
          initialNumToRender={2}
          onScrollBeginDrag={Keyboard.dismiss}
        />
      </View>
      {props.route.params.albumName !== "Main_Album" && (
        <View
          style={{
            position: "absolute",
            justifyContent: "center",
            alignItems: "center",
            width: 80,
            height: 80,
            bottom: 80,
            right: 40,
          }}
        >
          <TouchableOpacity
            style={{
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
            }}
            onPress={openModal}
          >
            <Ionicons
              name="add"
              size={50}
              color="#fff"
              style={{ justifyContent: "center", alignItems: "center" }}
            />
          </TouchableOpacity>
        </View>
      )}

      <ImagePickerModal
        modal={modal}
        closeModal={closeModal}
        dataImg={imagesState.Main_Album}
        addImgToAlbum={addImgToAlbum}
      />
    </View>
  );
};

export default Album;
