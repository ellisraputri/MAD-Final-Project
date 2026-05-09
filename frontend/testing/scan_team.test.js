// testing/scan_team.test.js

import React from "react";
import { render, fireEvent, waitFor } from "@testing-library/react-native";
import ScanTeamScreen from "@/app/(auth)/scan_team";

const mockRequestPermission = jest.fn();

let mockPermission = {
  granted: true,
};


jest.mock("expo-camera", () => {
  const React = require("react");
  const { View, Text } = require("react-native");

  return {
    CameraView: ({ onBarcodeScanned }) => (
      <Text
        testID="camera-view"
        onPress={() =>
          onBarcodeScanned({
            data: "TEAM123",
          })
        }
      >
        Camera
      </Text>
    ),

    useCameraPermissions: () => [
      mockPermission,
      mockRequestPermission,
    ],
  };
});

describe("ScanTeamScreen", () => {
  beforeEach(() => {
    jest.clearAllMocks();

    mockPermission = {
      granted: true,
    };
  });

  it("renders camera when permission granted", () => {
    const { getByTestId, getByText } = render(<ScanTeamScreen />);

    expect(getByText('Camera')).toBeTruthy();
    expect(getByText("Scan Team QR Code")).toBeTruthy();
  });

  it("requests permission if not granted", async () => {
    mockPermission = {
      granted: false,
    };

    const { getByText } = render(<ScanTeamScreen />);

    expect(getByText("Camera permission is required")).toBeTruthy();

    fireEvent.press(getByText("Grant Permission"));

    await waitFor(() => {
      expect(mockRequestPermission).toHaveBeenCalled();
    });
  });

  it("navigates after scanning QR code", async () => {
    const {router} = require('expo-router');
    const { getByTestId, getByText } = render(<ScanTeamScreen />);

    fireEvent.press(getByText('Camera'));

    await waitFor(() => {
      expect(router.replace).toHaveBeenCalledWith({
        pathname: "/(auth)/team_confirmation",
        params: {
          scannedTeamId: "TEAM123",
        },
      });
    });
  });

  it("does not scan twice", async () => {
    const {router} = require('expo-router');
    const { getByTestId, getByText } = render(<ScanTeamScreen />);

    const camera = getByText('Camera');

    fireEvent.press(camera);
    fireEvent.press(camera);

    await waitFor(() => {
      expect(router.replace).toHaveBeenCalledTimes(1);
    });
  });
});