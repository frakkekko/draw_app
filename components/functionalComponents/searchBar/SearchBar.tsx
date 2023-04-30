import React, {
  useState,
  useTransition,
  LegacyRef,
  MutableRefObject,
} from "react";
import { View, Text, TextInput, Dimensions } from "react-native";

// Icons
import { Ionicons } from "@expo/vector-icons";

type SearchBarProps = {
  onInputChange: Function;
  inputRef?: any;
};

const SearchBar = (props: SearchBarProps) => {
  const handleChangeText = (text: string): void => {
    props.onInputChange(text);
  };
  return (
    <View
      style={{
        height: 50,
        backgroundColor: "#333",
        width: "80%",
        borderRadius: 50,
        justifyContent: "center",
        alignItems: "center",
      }}
    >
      <View
        style={{
          flexDirection: "row",
          justifyContent: "space-between",
          alignItems: "center",
        }}
      >
        <Ionicons name="search-outline" size={24} color="#fff" />

        {!props.inputRef && (
          <TextInput
            placeholder="Search Image"
            onChangeText={handleChangeText}
            placeholderTextColor={"#777"}
            style={{
              fontSize: 20,
              color: "#fff",
              width: "80%",
              paddingLeft: 20,
              paddingRight: 20,
            }}
          />
        )}
        {props.inputRef && (
          <TextInput
            ref={props.inputRef}
            placeholder="Search Image"
            onChangeText={handleChangeText}
            placeholderTextColor={"#777"}
            style={{
              fontSize: 20,
              color: "#fff",
              width: "80%",
              paddingLeft: 20,
              paddingRight: 20,
            }}
          />
        )}
      </View>
    </View>
  );
};

export default SearchBar;
