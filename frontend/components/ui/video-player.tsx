import { View } from "react-native";
import { VideoView, useVideoPlayer } from "expo-video";
import { useEffect } from "react";

type Props = {
  link: string;
  vidHeight?: number;
};

export default function VideoPlayer({link, vidHeight=250}: Props) {
  const player = useVideoPlayer(
    link ? { uri: link } : null,
    (player) => {
      player.loop = false;
      player.play();
    }
  );

  useEffect(() => {
    if (link) {
      player.replace({ uri: link });
      player.play();
    }
  }, [link]);

  return (
    <View style={{ justifyContent: "center" }}>
      <VideoView
        player={player}
        style={{ width: 320, height: vidHeight }}
        fullscreenOptions={{enable: true}}
        allowsPictureInPicture
      />
    </View>
  );
}