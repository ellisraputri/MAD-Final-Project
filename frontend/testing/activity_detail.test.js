import React from "react";
import { render, waitFor } from "@testing-library/react-native";
import ActivityScreen from "../app/(tabs)/activity/[id]/activity.tsx";
import { socket } from "@/services/socket";

jest.mock("@react-navigation/native", () => ({
  useFocusEffect: (cb) => cb(),
}));

jest.mock("@/components/activity/main/activity1", () => {
  const React = require("react");
  const { Text } = require("react-native");
  return () => <Text>Activity 1</Text>;
});

jest.mock("@/components/activity/main/activity2", () => {
  const React = require("react");
  const { Text } = require("react-native");
  return () => <Text>Activity 2</Text>;
});

jest.mock("@/components/activity/main/activity3", () => {
  const React = require("react");
  const { Text } = require("react-native");
  return () => <Text>Activity 3</Text>;
});

jest.mock("@/components/activity/main/activity4", () => {
  const React = require("react");
  const { Text } = require("react-native");
  return () => <Text>Activity 4</Text>;
});

jest.mock("@/components/activity/main/activity5", () => {
  const React = require("react");
  const { Text } = require("react-native");
  return () => <Text>Activity 5</Text>;
});

jest.mock("@/components/activity/main/activity6", () => {
  const React = require("react");
  const { Text } = require("react-native");
  return () => <Text>Activity 6</Text>;
});

jest.mock("@/components/activity/main/activity7", () => {
  const React = require("react");
  const { Text } = require("react-native");
  return () => <Text>Activity 7</Text>;
});

jest.mock("@react-navigation/native", () => {
  const React = require("react");
  return {
    useFocusEffect: (cb) => {
      React.useEffect(cb, []); // ✅ run once
    },
  };
});

describe("ActivityDetail", () => {
  beforeEach(() => {
    const { useGlobalSearchParams } = require("expo-router");
    const { useAppContext } = require("@/context/AppContext");

    useGlobalSearchParams.mockReturnValue({ id: "6" });

    useAppContext.mockReturnValue({
      team: {
        id: "team1",
        members: ["A", "B"],
      },
    });

    handler = undefined;
    jest.clearAllMocks();
  });

  it("renders Activity 1 when id=1", () => {
    const { useGlobalSearchParams } = require("expo-router");

    useGlobalSearchParams.mockReturnValue({ id: "1" });

    const { getByText } = render(<ActivityScreen />);

    expect(getByText("Activity 1")).toBeTruthy();
  });

  it("renders Activity 2 when id=2", () => {
    const { useGlobalSearchParams } = require("expo-router");

    useGlobalSearchParams.mockReturnValue({ id: "2" });

    const { getByText } = render(<ActivityScreen />);

    expect(getByText("Activity 2")).toBeTruthy();
  });

  it("renders Activity 3 when id=3", () => {
    const { useGlobalSearchParams } = require("expo-router");

    useGlobalSearchParams.mockReturnValue({ id: "3" });

    const { getByText } = render(<ActivityScreen />);

    expect(getByText("Activity 3")).toBeTruthy();
  });

  it("renders Activity 4 when id=4", () => {
    const { useGlobalSearchParams } = require("expo-router");

    useGlobalSearchParams.mockReturnValue({ id: "4" });

    const { getByText } = render(<ActivityScreen />);

    expect(getByText("Activity 4")).toBeTruthy();
  });

  it("renders Activity 5 when id=5", () => {
    const { useGlobalSearchParams } = require("expo-router");

    useGlobalSearchParams.mockReturnValue({ id: "5" });

    const { getByText } = render(<ActivityScreen />);

    expect(getByText("Activity 5")).toBeTruthy();
  });

  it("renders Activity 6 when id=6", () => {
    const { useGlobalSearchParams } = require("expo-router");

    useGlobalSearchParams.mockReturnValue({ id: "6" });

    const { getByText } = render(<ActivityScreen />);

    expect(getByText("Activity 6")).toBeTruthy();
  });

  it("renders Activity 7 when id=7", () => {
    const { useGlobalSearchParams } = require("expo-router");

    useGlobalSearchParams.mockReturnValue({ id: "7" });

    const { getByText } = render(<ActivityScreen />);

    expect(getByText("Activity 7")).toBeTruthy();
  });

  it("emits socket event for activity 6", () => {
    render(<ActivityScreen />);

    expect(socket.emit).toHaveBeenCalledWith("get_team_active_users", {
      teamId: "team1",
    });
  });

  it("redirects if not all team members are online", async () => {
    const { router } = require("expo-router");
    global.alert = jest.fn();

    render(<ActivityScreen />);

    expect(handler).toBeDefined();

    handler({ users: ["A"] }); // only 1 online

    await waitFor(() => {
      expect(global.alert).toHaveBeenCalledWith(
        "All team members must be online to start this activity.",
      );
      expect(router.push).toHaveBeenCalledWith(
        "/(tabs)/activity/6/instructions",
      );
    });
  });

  it("does not redirect if all users are online", async () => {
    const { router } = require("expo-router");
    global.alert = jest.fn();

    render(<ActivityScreen />);

    expect(handler).toBeDefined();

    handler({ users: ["A", "B"] }); // all online

    await waitFor(() => {
      expect(global.alert).not.toHaveBeenCalled();
      expect(router.push).not.toHaveBeenCalled();
    });
  });
});
