import { View } from "react-native";
import { VideoView, useVideoPlayer } from "expo-video";
import { useEffect } from "react";

type Props = {
  link: string;
  vidWidth?: number;
  vidHeight?: number;
};

export default function VideoPlayer({link, vidWidth=320, vidHeight=250}: Props) {
  const player = useVideoPlayer(
    link ? { uri: link } : null,
    (player) => {
      player.loop = false;
    }
  );

  useEffect(() => {
    if (link) {
      player.replaceAsync({ uri: link });
    }
  }, [link]);

  return (
    <View style={{ flex: 1, justifyContent: "center" }}>
      <VideoView
        player={player}
        style={{ width: vidWidth, height: vidHeight }}
        fullscreenOptions={{enable: true}}
        allowsPictureInPicture
      />
    </View>
  );
}