import React, { FunctionComponent } from "react";
import { View, Text, StyleSheet, Dimensions } from "react-native";

// Components
import Signature from "../../components/functionalComponents/signature/Signature";

// Navigation
import type { NativeStackScreenProps } from "@react-navigation/native-stack";
import { RootStackParamList } from "../../App";

// Safe area context
import { EdgeInsets, useSafeAreaInsets } from "react-native-safe-area-context";

type DrawProps = NativeStackScreenProps<RootStackParamList, "Draw">;

const Draw: FunctionComponent<DrawProps> = (props: DrawProps) => {
  const insets: EdgeInsets = useSafeAreaInsets();

  return (
    <View
      style={{
        paddingTop: insets.top,
        paddingBottom: insets.bottom,
        justifyContent: "center",
        alignItems: "center",
      }}
    >
      <View
        style={{
          height: Dimensions.get("window").height - insets.top - insets.bottom,
          width: Dimensions.get("window").width,
        }}
      >
        <Signature text={props.route.params.drawName} />
      </View>
    </View>
  );
};

export default Draw;
