import React from "react";
import { render, fireEvent, waitFor, screen } from "@testing-library/react-native";
import { Alert } from "react-native";

import ActivityOneScreen from "@/components/activity/main/activity1";
import { uploadMedia } from "@/services/media/media";
import { submitResult } from "@/services/result/result";

// --- Mocks ---
jest.mock("@/hooks/use-app-theme", () => ({ useAppTheme: () => ({ background: "#fff", blackText: "#000" }) }));
jest.mock("@/context/AppContext", () => ({ useAppContext: () => ({ team: { id: "team1" } }) }));

jest.mock("@/components/activity/main/main-activity-style", () => ({
  createMainActivityStyles: () => ({
    mainView: { flex: 1 }, videoScreen: { height: 300 }, recordBtnArea: {}, 
    recordButtonOuter: {}, recordButtonInner: {}, recordingInner: {}, 
    titleText: {}, subtitleText: {}, buttonContainer: {}, modalContainer: {}, 
    titleModalText: {}, closeButton: {}, scrollView: {},
  }),
}));

jest.mock("@/components/ui/video-player", () => {
  const React = require("react");
  const { Text } = require("react-native");
  return function MockVideoPlayer({ link }) { return <Text>{link}</Text>; };
});

// Mocking the custom Button component to include a testID based on text
jest.mock("@/components/ui/button", () => {
  const React = require("react");
  const { TouchableOpacity, Text } = require("react-native");
  return function MockButton({ onPress, text, isDisabled, isLoading }) {
    return (
      <TouchableOpacity 
        disabled={isDisabled} 
        onPress={onPress} 
        accessibilityState={{ disabled: isDisabled }}
      >
        <Text>{isLoading ? "Loading..." : text}</Text>
      </TouchableOpacity>
    );
  };
});

jest.mock("@/components/activity/submission/activity1-submission-card", () => {
  const React = require("react");
  const { View, Text, TouchableOpacity, TextInput } = require("react-native");
  return function MockSubmissionCard(props) {
    return (
      <View>
        <Text>{`Submission ${props.item}`}</Text>
        <TextInput placeholder="Mass" value={props.mass} onChangeText={props.onChangeMass} />
        <TextInput placeholder="Time" value={props.time} onChangeText={props.onChangeTime} />
        <TouchableOpacity onPress={props.onDelete}><Text>Delete</Text></TouchableOpacity>
        <TouchableOpacity onPress={props.onRerecord}><Text>Rerecord</Text></TouchableOpacity>
      </View>
    );
  };
});

jest.mock("expo-camera", () => {
  const React = require("react");
  const { View } = require("react-native");
  return {
    CameraView: React.forwardRef((props, ref) => {
      React.useImperativeHandle(ref, () => ({
        recordAsync: jest.fn().mockResolvedValue({ uri: "video-uri.mp4" }),
        stopRecording: jest.fn(),
      }));
      React.useEffect(() => { props.onCameraReady?.(); }, []);
      return <View testID="mock-camera" style={props.style} />;
    }),
    useCameraPermissions: () => [{ granted: true }, jest.fn()],
    useMicrophonePermissions: () => [{ granted: true }, jest.fn()],
  };
});

// --- Tests ---

describe("ActivityOneScreen", () => {
  beforeEach(() => {
    jest.clearAllMocks();
    jest.spyOn(Alert, "alert").mockImplementation(() => {});
    global.alert = jest.fn();
  });

  const performRecordingFlow = async (getByText) => {
    const allTouchables = screen.root.findAllByType("TouchableOpacity");
    const recordButton = allTouchables[0]; 

    fireEvent.press(recordButton);
    await waitFor(() => expect(screen.getByText("video-uri.mp4")).toBeTruthy());
  };

  it("submits successfully with 3 videos", async () => {
    uploadMedia.mockResolvedValue({ id: "media1" });
    submitResult.mockResolvedValue({ success: true });

    const { getByText, getAllByPlaceholderText } = render(<ActivityOneScreen />);

    for (let i = 0; i < 3; i++) {
      await performRecordingFlow(getByText);
      fireEvent.press(getByText("Confirm Submission"));

      if (i < 2) {
        fireEvent.press(getByText("Add Another Submission"));
      }
    }

    const massInputs = getAllByPlaceholderText("Mass");
    const timeInputs = getAllByPlaceholderText("Time");

    massInputs.forEach((input, idx) => fireEvent.changeText(input, "10"));
    timeInputs.forEach((input, idx) => fireEvent.changeText(input, "5"));

    fireEvent.press(getByText("Submit"));

    await waitFor(() => {
      expect(uploadMedia).toHaveBeenCalledTimes(3);
      expect(submitResult).toHaveBeenCalled();
      expect(Alert.alert).toHaveBeenCalledWith("Success", expect.any(String), expect.any(Array));
    });
  });

  it("shows validation alert if less than 3 videos", async () => {
    const { getByText, getAllByPlaceholderText } = render(<ActivityOneScreen />);

    await performRecordingFlow(getByText);
    fireEvent.press(getByText("Confirm Submission"));

    fireEvent.changeText(getAllByPlaceholderText("Mass")[0], "10");
    fireEvent.changeText(getAllByPlaceholderText("Time")[0], "1");

    fireEvent.press(getByText("Submit"));

    expect(global.alert).toHaveBeenCalledWith(expect.stringContaining("3 videos"));
  });

  it("alerts when submitting incomplete fields", async () => {
    const { getByText } = render(<ActivityOneScreen />);

    await performRecordingFlow(getByText);
    fireEvent.press(getByText("Confirm Submission"));

    fireEvent.press(getByText("Submit"));

    expect(global.alert).toHaveBeenCalledWith("Please fill all mass and prediction fields.");
  });
});