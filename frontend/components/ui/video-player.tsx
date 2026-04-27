import { View } from "react-native";
import { VideoView, useVideoPlayer } from "expo-video";
import { useEffect } from "react";

type Props = {
  link: string;
  rate?: number;
  vidWidth?: number;
  vidHeight?: number;
};

export default function VideoPlayer({
  link,
  rate = 1.0,
  vidWidth = 320,
  vidHeight = 250,
}: Props) {
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

  return (
    <View style={{ flex: 1, justifyContent: "center" }}>
      <VideoView
        player={player}
        style={{ width: vidWidth, height: vidHeight }}
        fullscreenOptions={{ enable: true }}
        allowsPictureInPicture
      />
    </View>
  );
}
