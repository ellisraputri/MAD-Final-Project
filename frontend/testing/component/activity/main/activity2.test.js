import React from "react";
import { render, fireEvent, waitFor, cleanup } from "@testing-library/react-native";
import { Alert } from "react-native";
import ActivityTwoScreen from "@/components/activity/main/activity2";
import { uploadMedia } from "@/services/media/media";
import { submitResult } from "@/services/result/result";

// --- Mocks ---
jest.mock("@/hooks/use-app-theme", () => ({ useAppTheme: () => ({ background: "#fff", blackText: "#000" }) }));
jest.mock("@/context/AppContext", () => ({ useAppContext: () => ({ team: { id: "team1" } }) }));

jest.mock("@/components/activity/main/main-activity-style", () => ({
  createMainActivityStyles: () => ({
    mainView: { flex: 1 },
    buttonContainer: {},
    buttonPopup: {},
    buttonText: {},
    modalContainer: {},
    titleModalText: {},
    closeButton: {},
    scrollView: {},
    backBtn: {},
    btnText: {},
    disabledBtn: {},
  }),
}));

jest.mock("@/components/ui/audio-recording", () => {
  const React = require("react");
  const { TouchableOpacity, Text } = require("react-native");
  return function MockRecorder({ setResult, type, onPressButton }) {
    const handleRecord = () => {
      setResult((prev) => ({
        ...prev,
        [type]: { uri: "audio-uri.mp3", levels: [0.5, 0.8], input: "" }
      }));
      onPressButton(); 
    };
    return (
      <TouchableOpacity onPress={handleRecord} testID="mock-recorder">
        <Text>Tap to Record</Text>
      </TouchableOpacity>
    );
  };
});

jest.mock("@/components/ui/button", () => {
  const React = require("react");
  const { TouchableOpacity, Text } = require("react-native");
  return function MockButton({ onPress, text, isDisabled, isLoading }) {
    return (
      <TouchableOpacity 
        disabled={isDisabled || isLoading} 
        onPress={onPress}
      >
        <Text>{isLoading ? "Loading..." : text}</Text>
      </TouchableOpacity>
    );
  };
});

jest.mock("@/components/activity/submission/activity2-submission-card", () => {
  const React = require("react");
  const { View, Text, TouchableOpacity, TextInput } = require("react-native");
  return function MockSubmissionCard(props) {
    return (
      <View>
        <Text>{`Submission ${props.item}`}</Text>
        <TextInput placeholder="Prediction" value={props.input} onChangeText={props.onChangeInput} />
        <TouchableOpacity onPress={props.onDelete}><Text>Delete</Text></TouchableOpacity>
        <TouchableOpacity onPress={props.onRerecord}><Text>Rerecord</Text></TouchableOpacity>
      </View>
    );
  };
});

// --- Tests ---

describe("ActivityTwoScreen", () => {
  beforeEach(() => {
    jest.clearAllMocks();
    jest.spyOn(Alert, "alert").mockImplementation((title, msg, buttons) => {
        if (buttons && buttons[1] && buttons[1].text === "OK") {
            buttons[1].onPress();
        }
    });
    global.alert = jest.fn();
  });

  afterEach(cleanup);

  // Helper function using passed-in queries
  const performRecordingFlow = async (queries) => {
    fireEvent.press(queries.getByText("Tap to Record"));
    fireEvent.press(queries.getByText("Confirm Submission"));
  };

  it("submits successfully with 3 audios", async () => {
    uploadMedia.mockResolvedValue({ id: "media1" });
    submitResult.mockResolvedValue({ success: true });

    const utils = render(<ActivityTwoScreen />);
    const { getByText, getAllByPlaceholderText } = utils;

    for (let i = 0; i < 3; i++) {
      await performRecordingFlow(utils);
      
      if (i < 2) {
        fireEvent.press(getByText("Add Another Submission"));
      }
    }

    const inputs = getAllByPlaceholderText("Prediction");
    inputs.forEach((input) => fireEvent.changeText(input, "10"));

    fireEvent.press(getByText("Submit"));

    await waitFor(() => {
      expect(uploadMedia).toHaveBeenCalledTimes(3);
      expect(submitResult).toHaveBeenCalled();
      expect(Alert.alert).toHaveBeenCalledWith("Success", expect.any(String), expect.any(Array));
    });
  });

  it("shows validation alert if less than 3 audios", async () => {
    const utils = render(<ActivityTwoScreen />);
    const { getByText, getAllByPlaceholderText } = utils;

    await performRecordingFlow(utils);

    // We only have 1 input now
    const inputs = getAllByPlaceholderText("Prediction");
    fireEvent.changeText(inputs[0], "10");

    fireEvent.press(getByText("Submit"));

    expect(global.alert).toHaveBeenCalledWith(expect.stringContaining("3 audios"));
  });

  it("alerts when submitting incomplete fields", async () => {
    const utils = render(<ActivityTwoScreen />);
    const { getByText } = utils;

    await performRecordingFlow(utils);

    fireEvent.press(getByText("Submit"));

    expect(global.alert).toHaveBeenCalledWith("Please fill all prediction fields.");
  });
});