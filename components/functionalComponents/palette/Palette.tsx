import React, { FunctionComponent, useState } from "react";
import { View, Text, TouchableOpacity, Image } from "react-native";

// Styles
import paletteStyles from "./paletteStyles";

// Slider
import Slider from "@react-native-community/slider";

// BlurView
import { BlurView } from "expo-blur";

// Draggable
import Draggable from "react-native-draggable";

// Icons
import { Ionicons } from "@expo/vector-icons";

// Images
import colorPickerRgbImg from "../../../assets/imgs/colors.png";

type PaletteProps = {
  handleChangeColor: Function;
  handleChangeStroke: Function;
  handleSelectEraser: Function;
  handleSave: Function;
  handleClear: Function;
  handleBackground: Function;
  handleUndo: Function;
  handleRedo: Function;
  openModal: Function;
};

const Palette: FunctionComponent<PaletteProps> = (props: PaletteProps) => {
  let [colorPickerActive, setColorPikerActive] = useState<boolean>(false);
  let [strokeValue, setStrokeValue] = useState<number>();
  let [eraserPickerActive, setEraserPikerActive] = useState<boolean>(false);
  let [strokePickerActive, setStrokePikerActive] = useState<boolean>(false);

  const handleChangeColor =
    (color: string): (() => void) =>
    (): void => {
      setColorPikerActive(false);
      props.handleChangeColor(color);
    };
  const handleChangeStroke = (strokeValue: number) => {
    setStrokePikerActive(false);
    console.log(Number(strokeValue).toFixed(1));
    props.handleChangeStroke(Number(strokeValue.toFixed(1)));
  };
  const handleSelectEraser = () => {
    setEraserPikerActive(false);
    props.handleSelectEraser();
  };

  const handleSave = () => {
    props.handleSave();
  };

  const handleClear = () => {
    props.handleClear();
  };

  const handleBackground = () => {
    props.handleBackground();
  };

  const toggleColorPicker = (): void => {
    setColorPikerActive(!colorPickerActive);
  };

  const toggleStrokePicker = (): void => {
    setStrokePikerActive(!strokePickerActive);
  };

  const handleUndo = () => {
    props.handleUndo();
  };

  const handleRedo = () => {
    props.handleRedo();
  };

  const handleUpdateStrokeValue = (value: number): void => {
    // console.log(value.toFixed(2));
    setStrokeValue(Number(value.toFixed(1)));
  };

  const handleModal = (): void => {
    setColorPikerActive(false);
    props.openModal();
  };

  return (
    <View style={{ borderRadius: 20, overflow: "hidden" }}>
      <BlurView
        intensity={50}
        tint="dark"
        style={{
          ...paletteStyles.mainView,
          justifyContent: "flex-start",
          alignItems: "flex-start",
        }}
      >
        <View style={paletteStyles.subViewWrapper}>
          <TouchableOpacity onPress={toggleColorPicker}>
            <Text style={paletteStyles.paletteText}>
              <Ionicons name="color-fill-outline" size={34} color="#fff" />
            </Text>
          </TouchableOpacity>
          {colorPickerActive && (
            <View style={{ borderRadius: 20, overflow: "hidden" }}>
              <BlurView
                intensity={50}
                tint="dark"
                style={[
                  {
                    height: 80,
                    justifyContent: "space-around",
                    alignItems: "center",
                    flexDirection: "row",
                    zIndex: 30,
                    gap: 10,
                    padding: 20,
                  },
                ]}
              >
                <TouchableOpacity onPress={handleChangeColor("#000")}>
                  <View
                    style={{
                      ...paletteStyles.itemPicker,
                      backgroundColor: "#000",
                    }}
                  ></View>
                </TouchableOpacity>
                <TouchableOpacity onPress={handleChangeColor("#0000ff")}>
                  <View
                    style={{
                      ...paletteStyles.itemPicker,
                      backgroundColor: "#0000ff",
                    }}
                  ></View>
                </TouchableOpacity>
                <TouchableOpacity onPress={handleChangeColor("#ff0000")}>
                  <View
                    style={{
                      ...paletteStyles.itemPicker,
                      backgroundColor: "#ff0000",
                    }}
                  ></View>
                </TouchableOpacity>
                <TouchableOpacity onPress={handleModal}>
                  <View
                    style={[paletteStyles.itemPicker, { overflow: "hidden" }]}
                  >
                    <Image
                      source={colorPickerRgbImg}
                      style={{ width: 35, height: 35 }}
                    />
                  </View>
                </TouchableOpacity>
              </BlurView>
            </View>
          )}
          <TouchableOpacity onPress={toggleStrokePicker}>
            <Text style={paletteStyles.paletteText}>
              <Ionicons name="pencil-outline" size={34} color="#fff" />
            </Text>
          </TouchableOpacity>
          {strokePickerActive && (
            <View style={{ borderRadius: 20, overflow: "hidden" }}>
              <BlurView
                intensity={50}
                tint="dark"
                style={[
                  {
                    height: 80,
                    justifyContent: "space-around",
                    flexDirection: "column",
                    zIndex: 30,
                  },
                ]}
              >
                <Text
                  style={{ fontSize: 20, color: "#fff", textAlign: "center" }}
                >
                  {!strokeValue ? 1 : strokeValue}
                </Text>
                <Slider
                  value={!strokeValue ? 1 : strokeValue}
                  onSlidingComplete={handleChangeStroke}
                  onValueChange={handleUpdateStrokeValue}
                  minimumValue={1}
                  maximumValue={20}
                  style={{ width: 220, height: 40 }}
                  step={0.1}
                />
              </BlurView>
            </View>
          )}
          <View style={{ position: "relative" }}>
            <TouchableOpacity onPress={handleSelectEraser}>
              <Text style={paletteStyles.paletteText}>
                <Ionicons name="clipboard-outline" size={34} color="#fff" />
              </Text>
            </TouchableOpacity>
          </View>
          <View>
            <TouchableOpacity onPress={handleSave}>
              <Text style={paletteStyles.paletteText}>
                <Ionicons name="download-outline" size={34} color="#fff" />
              </Text>
            </TouchableOpacity>
          </View>
          <View>
            <TouchableOpacity onPress={handleClear}>
              <Text style={paletteStyles.paletteText}>
                <Ionicons name="close-outline" size={34} color="#fff" />
              </Text>
            </TouchableOpacity>
          </View>
          <View>
            <TouchableOpacity onPress={handleBackground}>
              <Text style={paletteStyles.paletteText}>Set Bg</Text>
            </TouchableOpacity>
          </View>
          <View>
            <TouchableOpacity onPress={handleUndo}>
              <Text style={paletteStyles.paletteText}>
                <Ionicons name="arrow-undo-outline" size={34} color="#fff" />
              </Text>
            </TouchableOpacity>
          </View>
          <View>
            <TouchableOpacity onPress={handleRedo}>
              <Text style={paletteStyles.paletteText}>
                <Ionicons name="arrow-redo-outline" size={34} color="#fff" />
              </Text>
            </TouchableOpacity>
          </View>
        </View>
      </BlurView>
    </View>
  );
};

export default Palette;
