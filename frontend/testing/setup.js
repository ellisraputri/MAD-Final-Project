import React from "react";
import Button from "../components/ui/button.tsx";

jest.mock("../hooks/use-app-theme.ts", () => ({
  useAppTheme: () => ({
    background: "#fff",
    placeholderText: "#999",
  }),
}));

jest.mock("../components/ui/button.tsx", () => {
  const React = require("react");
  const { Text, KeyboardAvoidingView } = require("react-native");
  return function MockButton({ onPress, text }) {
    return <Text onPress={onPress}>{text}</Text>;
  };
});

jest.mock("react-native", () => {
  const React = require("react");
  return {
    StyleSheet: {
      create: (styles) => styles,
      flatten: (styles) => styles,
      hairlineWidth: 1,
    },
    View: ({ children }) =>
      React.createElement(React.Fragment, null, children || null),
    KeyboardAvoidingView: ({ children }) =>
      React.createElement(React.Fragment, null, children || null),
    Text: ({ children, onPress }) =>
      React.createElement("Text", { onPress }, children || null),
    TextInput: (props) => React.createElement("TextInput", props),
    TouchableOpacity: ({ children, onPress }) =>
      React.createElement("TouchableOpacity", { onPress }, children || null),
    ScrollView: ({ children }) =>
      React.createElement(React.Fragment, null, children || null),
    Modal: ({ children }) =>
      React.createElement(React.Fragment, null, children || null),
    Image: ({ children }) =>
      React.createElement(React.Fragment, null, children || null),
    ImageBackground: ({ children }) =>
      React.createElement(React.Fragment, null, children || null),
    Platform: { OS: "ios", select: (obj) => obj.ios ?? obj.default },
    Alert: { alert: jest.fn() },
  };
});

jest.mock("react-native-svg", () => {
  const React = require("react");
  return {
    __esModule: true,
    default: ({ children }) =>
      React.createElement(React.Fragment, null, children || null),
    Polygon: () => null,
  };
});

jest.mock("react-native-keyboard-aware-scroll-view", () => {
  const React = require("react");
  return {
    KeyboardAwareScrollView: ({ children }) =>
      React.createElement(React.Fragment, null, children),
  };
});

jest.mock("expo-router", () => ({
  useRouter: () => ({
    replace: jest.fn(),
    push: jest.fn(),
  }),
}));

jest.mock("expo-sqlite", () => ({
  openDatabase: jest.fn(),
}));

jest.mock("sonner-native", () => ({
  toast: {
    error: jest.fn(),
  },
}));

global.alert = jest.fn();
