import { StatusBar } from "expo-status-bar";
import { StyleSheet, Text, View } from "react-native";
import { FunctionComponent } from "react";
import { NavigationContainer } from "@react-navigation/native";
import { createNativeStackNavigator } from "@react-navigation/native-stack";

// Screens
import Home from "./screens/home/Home";
import AppAssets from "./screens/appAssets/AppAssets";
import Draw from "./screens/draw/Draw";
import Album from "./screens/album/Album";
import ImageView from "./screens/image/ImageView";

// Styles
import { DarkTheme } from "@react-navigation/native";

// Safe area context
import { SafeAreaProvider } from "react-native-safe-area-context";

// Store Redux
import store from "./redux/store";
import { Provider } from "react-redux";

export type RootStackParamList = {
  Home: undefined;
  Draw: { drawName: string };
  AppAssets: undefined;
  Album: { albumName: string; headerTitle: string };
  ImageView: { img: string; albumName: string };
};

const Stack = createNativeStackNavigator<RootStackParamList>();

const App: FunctionComponent = (): JSX.Element => {
  return (
    <SafeAreaProvider>
      <Provider store={store}>
        <View style={{ flex: 1, backgroundColor: "#000" }}>
          <StatusBar style="light" />
          <NavigationContainer theme={DarkTheme}>
            <Stack.Navigator initialRouteName="Home">
              <Stack.Screen name="Home" component={Home} />
              <Stack.Screen
                name="Draw"
                component={Draw}
                options={{ headerShown: false }}
              />
              <Stack.Screen name="AppAssets" component={AppAssets} />
              <Stack.Screen
                name="Album"
                component={Album}
                options={({ route }) => ({ title: route.params.headerTitle })}
              />
              <Stack.Screen
                name="ImageView"
                component={ImageView}
                options={{ headerShown: false }}
              />
            </Stack.Navigator>
          </NavigationContainer>
        </View>
      </Provider>
    </SafeAreaProvider>
  );
};

export default App;
