import { Text, View } from "react-native";
import { VideoView, useVideoPlayer } from "expo-video";
import { useEffect, useState } from "react";

type Props = {
  link: string;
  rate?: number;
  vidWidth?: number;
  vidHeight?: number;
  showCurrTime?: boolean;
};

export default function VideoPlayer({
  link,
  rate = 1.0,
  vidWidth = 320,
  vidHeight = 250,
  showCurrTime = false,
}: Props) {
  const [currentTime, setCurrentTime] = useState(0);

  const player = useVideoPlayer(link ? { uri: link } : null, (player) => {
    player.loop = false;
  });

  useEffect(() => {
    if (link) {
      player.replaceAsync({ uri: link });
    }
  }, [link]);

  useEffect(() => {
    if (player) {
      player.playbackRate = rate;
    }
  }, [rate, player]);

  useEffect(() => {
    if (!player || !showCurrTime) return;
    const interval = setInterval(() => {
      setCurrentTime(player.currentTime ?? 0);
    }, 100);

    return () => clearInterval(interval);
  }, [player, showCurrTime]);

  return (
    <View style={{ flex: 1, justifyContent: "center" }}>
      {showCurrTime && (
        <Text
          style={{
            marginBottom: 8,
            textAlign: "center",
            color: "#aaa",
          }}
        >
          Current time: {currentTime.toFixed(3)} s
        </Text>
      )}

      <VideoView
        player={player}
        style={{ width: vidWidth, height: vidHeight }}
        fullscreenOptions={{ enable: true }}
        allowsPictureInPicture
      />
    </View>
  );
}
