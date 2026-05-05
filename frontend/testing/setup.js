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

jest.mock("@/components/ui/loading", () => {
  const React = require("react");
  const { Text } = require("react-native");
  return () => <Text>Loading...</Text>;
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
  router: {
    push: jest.fn(),
    replace: jest.fn(),
  },
}));

jest.mock("expo-sqlite", () => ({
  openDatabase: jest.fn(),
}));

jest.mock("sonner-native", () => ({
  toast: {
    error: jest.fn(),
  },
}));

jest.mock("@/services/socket", () => ({
  socket: {
    emit: jest.fn(),
    on: jest.fn(),
    off: jest.fn(),
    connected: true,
  },
}));

jest.mock("@/components/ui/ranking-card", () => {
  const React = require("react");
  const { Text } = require("react-native");
  return ({ rank, teamName }) => <Text>{`Rank ${rank} ${teamName}`}</Text>;
});

jest.mock("@/components/ui/podium-card", () => {
  const React = require("react");
  const { Text } = require("react-native");
  return ({ rank, name }) => <Text>{`Podium ${rank} ${name}`}</Text>;
});

jest.mock("@expo/vector-icons", () => {
  const React = require("react");
  const { Text } = require("react-native");

  return {
    Ionicons: ({ name }) => <Text>{name}</Text>,
  };
});

jest.mock("expo-image-picker", () => ({
  requestMediaLibraryPermissionsAsync: jest.fn(() =>
    Promise.resolve({ granted: true }),
  ),
  launchImageLibraryAsync: jest.fn(() => Promise.resolve({ canceled: true })),
  MediaTypeOptions: {
    Images: "Images",
  },
}));

jest.mock("@/context/AppContext", () => ({
  useAppContext: () => ({
    user: { id: "1", firstName: "John" },
    setUser: jest.fn(),
    team: {
      id: "team1",
      name: "My Team",
      grade: 10,
      logo: "logo.png",
    },
    setTeam: jest.fn(),
  }),
}));

global.alert = jest.fn();
