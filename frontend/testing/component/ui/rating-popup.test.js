import React from "react";
import { render, fireEvent, waitFor } from "@testing-library/react-native";

jest.mock("react-native-safe-area-context", () => {
  const React = require("react");
  const { View } = require("react-native");

  return {
    SafeAreaView: ({ children }) => <View>{children}</View>,
  };
});

import RatingPopup from "@/components/ui/rating-popup";
import { submitRating } from "@/services/result/result";
import { toast } from "sonner-native";

jest.mock("@/components/ui/button", () => {
  const React = require("react");
  const { TouchableOpacity, Text } = require("react-native");

  return ({ text, onPress }) => (
    <TouchableOpacity onPress={onPress}>
      <Text>{text}</Text>
    </TouchableOpacity>
  );
});

describe("RatingPopup", () => {
    const TextInput = require('react-native');
  const onClose = jest.fn();

  beforeEach(() => {
    jest.clearAllMocks();

    global.alert = jest.fn();
  });

  it("renders modal title", () => {
    const { getByText } = render(
      <RatingPopup
        activityId="6"
        resultId="result-1"
        showModal={true}
        onClose={onClose}
      />,
    );

    expect(getByText("Rate Activity 6")).toBeTruthy();
  });

  it("calls onClose when close button pressed", () => {
    const { getByText } = render(
      <RatingPopup
        activityId="6"
        resultId="result-1"
        showModal={true}
        onClose={onClose}
      />,
    );

    fireEvent.press(getByText("close"));

    expect(onClose).toHaveBeenCalled();
  });

  it("selects star rating", () => {
    const { getAllByText } = render(
      <RatingPopup
        activityId="6"
        resultId="result-1"
        showModal={true}
        onClose={onClose}
      />,
    );

    const stars = getAllByText("star-outline");

    fireEvent.press(stars[2]);

    expect(getAllByText("star").length).toBe(3);
  });

  it("shows alert when submitting without rating", async () => {
    const { getByText } = render(
      <RatingPopup
        activityId="6"
        resultId="result-1"
        showModal={true}
        onClose={onClose}
      />,
    );

    fireEvent.press(getByText("Submit"));

    await waitFor(() => {
      expect(global.alert).toHaveBeenCalledWith(
        "Please provide the star rating!",
      );
    });
  });

  it("submits rating successfully", async () => {
    (submitRating).mockResolvedValue({
      success: true,
    });

    const { getAllByText, getByText } = render(
      <RatingPopup
        activityId="6"
        resultId="result-1"
        showModal={true}
        onClose={onClose}
      />,
    );

    fireEvent.press(getAllByText("star-outline")[4]);

    fireEvent.press(getByText("Submit"));

    await waitFor(() => {
      expect(submitRating).toHaveBeenCalledWith({
        resultId: "result-1",
        ratings: 5,
        comments: "",
      });
    });

    expect(global.alert).toHaveBeenCalledWith(
      "Successfully rate this activity!",
    );

    expect(onClose).toHaveBeenCalled();
  });

  it("shows toast error when API fails", async () => {
    (submitRating).mockResolvedValue({
      success: false,
      message: "Failed",
    });

    const { getAllByText, getByText } = render(
      <RatingPopup
        activityId="6"
        resultId="result-1"
        showModal={true}
        onClose={onClose}
      />,
    );

    fireEvent.press(getAllByText("star-outline")[0]);

    fireEvent.press(getByText("Submit"));

    await waitFor(() => {
      expect(toast.error).toHaveBeenCalledWith("Failed");
    });
  });

  it("handles thrown error", async () => {
    (submitRating).mockRejectedValue(new Error("Network error"));

    const consoleSpy = jest
      .spyOn(console, "error")
      .mockImplementation(() => {});

    const { getAllByText, getByText } = render(
      <RatingPopup
        activityId="6"
        resultId="result-1"
        showModal={true}
        onClose={onClose}
      />,
    );

    fireEvent.press(getAllByText("star-outline")[1]);

    fireEvent.press(getByText("Submit"));

    await waitFor(() => {
      expect(toast.error).toHaveBeenCalledWith("Something went wrong");
    });

    consoleSpy.mockRestore();
  });

  it("matches snapshot", () => {
    const tree = render(
      <RatingPopup
        activityId="6"
        resultId="result-1"
        showModal={true}
        onClose={onClose}
      />,
    ).toJSON();

    expect(tree).toMatchSnapshot();
  });
});