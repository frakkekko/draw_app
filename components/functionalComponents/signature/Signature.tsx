import React, { FunctionComponent, useRef, useEffect, useState } from "react";
import {
  View,
  Dimensions,
  Alert,
  Image,
  ImageBackground,
  Platform,
} from "react-native";

// ScreenShot
import { captureRef } from "react-native-view-shot";

// Image Picker
import * as ImagePicker from "expo-image-picker";

// Media Library
import * as MediaLibrary from "expo-media-library";

// Styles
import { signatureWebStyle } from "./signatureStyles";

// File System
import * as FileSystem from "expo-file-system";

// Draw
import SignatureScreen, {
  SignatureViewRef,
} from "react-native-signature-canvas";

// Components
import Palette from "../palette/Palette";

// Draggable
import Draggable from "react-native-draggable";

// Safe area context
import { useSafeAreaInsets } from "react-native-safe-area-context";
import ColorPickerModal from "../colorPickerModal/ColorPickerModal";

interface SignatureProps {
  text: string;
}

const Signature: FunctionComponent<SignatureProps> = (
  props: SignatureProps
) => {
  let [base64Signature, setBase64Signature] = useState<string>("");
  let [bgImg, setBgImg] = useState<string>("");
  let [isSignatureShown, setSignatureShown] = useState<boolean>(true);
  let [modal, setModal] = useState<boolean>(false);

  const signatureRef = useRef<SignatureViewRef>(null);
  const screenShotRef = useRef<View>(null);

  const insets = useSafeAreaInsets();

  useEffect(() => {
    if (isSignatureShown === false) {
      setSignatureShown(true);
    }
  }, [isSignatureShown]);

  const saveDraw = async (): Promise<void> => {
    try {
      const response: MediaLibrary.PermissionResponse =
        await MediaLibrary.requestPermissionsAsync();

      if (response.status === "granted") {
        if (!FileSystem.documentDirectory) return;

        const directory = await FileSystem.readDirectoryAsync(
          FileSystem.documentDirectory
        );
        if (!directory.includes("Main_Album")) {
          await FileSystem.makeDirectoryAsync(
            FileSystem.documentDirectory + "Main_Album"
          );
        }

        const base64Data = await captureRef(screenShotRef, {
          quality: 1,
          result: "base64",
          handleGLSurfaceViewOnAndroid: true,
          format: "png",
          fileName: "tmpImg",
        });
        await FileSystem.writeAsStringAsync(
          FileSystem.documentDirectory + `Main_Album/${props.text}.png`,
          base64Data,
          { encoding: FileSystem.EncodingType.Base64 }
        );
        await MediaLibrary.saveToLibraryAsync(
          FileSystem.documentDirectory + `Main_Album/${props.text}.png`
        );
      } else {
        return Alert.alert(
          "Permission denied",
          "Access to Media Library denied"
        );
      }
      Alert.alert("Image saved", "Image saved with success");
    } catch (err) {
      Alert.alert(
        "Something went wrong",
        "An error occurred while saving the drawing"
      );
      console.error(err);
    }
  };

  const handleChangeColor = (color: string): void => {
    setModal(false);
    signatureRef.current?.draw();
    signatureRef.current?.changePenColor(color);
  };
  const handleChangeStroke = (stroke: number): void => {
    signatureRef.current?.changePenSize(stroke - 1, stroke + 1);
  };
  const handleSelectEraser = (): void => {
    signatureRef.current?.erase();
  };

  const handleClear = (): void => {
    console.log("handleClear");
    signatureRef.current?.clearSignature();
    setBase64Signature("");
  };

  const handleBackground = async (): Promise<void> => {
    console.log("handleBackground");

    Alert.alert(
      "Select a choose",
      "Select from where you want pick the photo",
      [
        {
          text: "Camera",
          onPress: async (): Promise<void> => {
            try {
              console.log("camera");
              const response =
                await ImagePicker.requestCameraPermissionsAsync();
              console.log("response:", response);
              if (response.status !== "granted")
                return Alert.alert(
                  "Permission denied",
                  "Permission for access to camera denied"
                );

              const result = await ImagePicker.launchCameraAsync({
                quality: 1,
                base64: true,
              });
              if (!result.assets) return;
              if (!result.assets[0].base64) return;

              const base64Data: string = result.assets[0].base64;
              const base64Uri: string = "data:image/png;base64," + base64Data;
              console.log("set the state");
              setBgImg(base64Uri);
              setSignatureShown(false);
            } catch (err) {
              console.log(err);
              Alert.alert(
                "Something went wrong",
                "There was an error launching the camera"
              );
            }
          },
        },
        {
          text: "Gallery",
          onPress: async (): Promise<void> => {
            try {
              const response: ImagePicker.MediaLibraryPermissionResponse =
                await ImagePicker.requestMediaLibraryPermissionsAsync();

              if (response.status !== "granted")
                return Alert.alert(
                  "Permission denied",
                  "Permission for access to Media Library denied"
                );

              const result: ImagePicker.ImagePickerResult =
                await ImagePicker.launchImageLibraryAsync({
                  quality: 1,
                  base64: true,
                });

              if (!result.assets) return;
              if (!result.assets[0].base64) return;

              const base64Data: string = result.assets[0].base64;
              const base64Uri: string = "data:image/png;base64," + base64Data;
              console.log("set the state");
              setBgImg(base64Uri);
              setSignatureShown(false);
            } catch (err) {
              console.log(err);
              Alert.alert(
                "Something went wrong",
                "There was an error launching the Image Picker"
              );
            }
          },
        },
      ]
    );
  };

  const handleUndo = (): void => {
    console.log("undo");
    signatureRef.current?.undo();

    if (Platform.OS !== "ios") signatureRef.current?.readSignature();
  };

  const handleRedo = (): void => {
    console.log("redo");
    signatureRef.current?.redo();

    if (Platform.OS !== "ios") signatureRef.current?.readSignature();
  };
  const handleEnd = (): void => {
    console.log("END");
    signatureRef.current?.readSignature(); // trigger the onOk event
  };

  const handleBase64Signature = (signature: string): void => {
    console.log("signature read");
    setBase64Signature(signature);
  };

  const openModal = (): void => {
    setModal(true);
  };

  const closeModal = (): void => {
    setModal(false);
  };

  return (
    <View style={{ flex: 1 }}>
      <Draggable>
        <Palette
          handleChangeColor={handleChangeColor}
          handleSelectEraser={handleSelectEraser}
          handleChangeStroke={handleChangeStroke}
          handleSave={saveDraw}
          handleClear={handleClear}
          handleBackground={handleBackground}
          handleUndo={handleUndo}
          handleRedo={handleRedo}
          openModal={openModal}
        />
      </Draggable>

      {Platform.OS !== "ios" && (
        <>
          <View
            style={{
              flex: 1,
              zIndex: -10,
              position: "absolute",
              top: 0,
              left: 0,
              width: Dimensions.get("window").width,
              height:
                Dimensions.get("window").height - insets.top - insets.bottom,
            }}
            collapsable={false}
            ref={screenShotRef}
          >
            <View
              style={{
                flex: 1,
                backgroundColor: "#fff",
                justifyContent: "center",
                alignItems: "center",
              }}
            >
              {bgImg !== "" && base64Signature !== "" && (
                <ImageBackground
                  source={{ uri: bgImg }}
                  style={{
                    width: Dimensions.get("window").width,
                    height:
                      Dimensions.get("window").height -
                      insets.top -
                      insets.bottom,
                    zIndex: 1,
                  }}
                >
                  <Image
                    style={{
                      width: Dimensions.get("window").width,
                      height:
                        Dimensions.get("window").height -
                        insets.top -
                        insets.bottom,
                      zIndex: 1,
                    }}
                    resizeMode="contain"
                    source={{ uri: base64Signature }}
                  />
                </ImageBackground>
              )}

              {base64Signature !== "" && bgImg === "" && (
                <Image
                  style={{
                    width: Dimensions.get("window").width,
                    height:
                      Dimensions.get("window").height -
                      insets.top -
                      insets.bottom,
                    zIndex: 10,
                  }}
                  resizeMode="contain"
                  source={{ uri: base64Signature }}
                />
              )}
            </View>
          </View>
          <View style={{ flex: 1, zIndex: -1 }}>
            <SignatureScreen
              ref={signatureRef}
              bgSrc={bgImg}
              bgHeight={
                Dimensions.get("window").height - insets.top - insets.bottom
              }
              bgWidth={Dimensions.get("window").width}
              onOK={handleBase64Signature}
              onEnd={handleEnd}
              trimWhitespace={true}
              penColor="#000"
              confirmText="Save"
              autoClear={false}
              descriptionText={props.text}
              style={{ flex: 1 }}
              webStyle={signatureWebStyle}
            />
          </View>
        </>
      )}

      {Platform.OS === "ios" && isSignatureShown && (
        <View
          style={{ flex: 1, zIndex: -1 }}
          ref={screenShotRef}
          collapsable={false}
        >
          <SignatureScreen
            ref={signatureRef}
            bgSrc={bgImg}
            bgHeight={
              Dimensions.get("window").height - insets.top - insets.bottom
            }
            bgWidth={Dimensions.get("window").width}
            // onOK={handleBase64Signature}
            trimWhitespace={true}
            penColor="#000"
            confirmText="Save"
            autoClear={false}
            descriptionText={props.text}
            style={{ flex: 1 }}
            webStyle={signatureWebStyle}
          />
        </View>
      )}
      <ColorPickerModal
        onColorSelected={handleChangeColor}
        closeModal={closeModal}
        modal={modal}
      />
    </View>
  );
};

export default Signature;
