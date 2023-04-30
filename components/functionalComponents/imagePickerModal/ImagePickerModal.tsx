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
import * as FileSystem from "expo-file-system";
import { replace } from "lodash";
import SearchBar from "../searchBar/SearchBar";
import { Keyboard } from "react-native";

type ImagePickerModalProps = {
  modal: boolean;
  closeModal: Function;
  addImgToAlbum: Function;
  dataImg: string[];
};

const ImagePickerModal: FunctionComponent<ImagePickerModalProps> = (
  props: ImagePickerModalProps
) => {
  let [imagesFiltered, setImageFiltered] = useState<string[] | null>(null);

  const closeModal = (): void => {
    props.closeModal();
  };

  const addImgToAlbum =
    (item: string): ((e: GestureResponderEvent) => void) =>
    (e: GestureResponderEvent): void => {
      props.addImgToAlbum(item);
    };

  const extractKey = (item: string): string => {
    return "ImagePickerModal:" + item;
  };

  const updateFilter = (str: string): void => {
    const updateFilter = props.dataImg.filter((imageName: string) => {
      str = replace(str, /\s+/g, "_");
      return imageName.toLowerCase().includes(str.toLowerCase());
    });

    if (str === "") return setImageFiltered(null);

    setImageFiltered([...updateFilter]);
    console.log(str);
  };

  const renderItem = ({ item }: any): JSX.Element => {
    return (
      <View style={{ position: "relative" }}>
        <TouchableWithoutFeedback
          style={{ height: 300 }}
          onPress={addImgToAlbum(item)}
        >
          <Image
            source={{
              uri: `${FileSystem.documentDirectory}Main_Album/${item}`,
            }}
            style={{
              width: Dimensions.get("window").width,
              height: 300,
              marginTop: 3,
            }}
          />
        </TouchableWithoutFeedback>
        <Text
          style={{
            position: "absolute",
            bottom: 20,
            left: 20,
            fontSize: 18,
            textShadowColor: "rgba(0, 0, 0, 0.4)",
            textShadowOffset: { width: -2, height: 2 },
            textShadowRadius: 4,
          }}
        >
          {replace(item.slice(0, -4), /_/g, " ")}
        </Text>
      </View>
    );
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
        }}
      >
        <View
          style={{
            height: Dimensions.get("window").height * 0.85,
            width: Dimensions.get("window").width,
            backgroundColor: "#222",
            borderTopLeftRadius: 20,
            borderTopRightRadius: 20,
            position: "relative",
          }}
        >
          <Text
            style={{
              fontSize: 26,
              color: "#fff",
              textAlign: "center",
              marginTop: 20,
            }}
          >
            Main Album Images
          </Text>
          <TouchableOpacity
            style={{ position: "absolute", top: 20, left: 20 }}
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
          <View
            style={{
              padding: 10,
              backgroundColor: "#222",
              justifyContent: "center",
              alignItems: "center",
            }}
          >
            <SearchBar onInputChange={updateFilter} />
          </View>
          <View style={{ flex: 1, backgroundColor: "#111" }}>
            <FlashList
              renderItem={renderItem}
              data={imagesFiltered === null ? props.dataImg : imagesFiltered}
              estimatedItemSize={300}
              keyExtractor={extractKey}
              onScrollBeginDrag={Keyboard.dismiss}
            />
          </View>
        </View>
      </View>
    </Modal>
  );
};

export default ImagePickerModal;
