import { View } from "react-native";
import { VideoView, useVideoPlayer } from "expo-video";

export default function VideoPlayer(props: {link: string}) {
  const player = useVideoPlayer(
    props.link,
    (player) => {
      player.loop = false;
    }
  );

  return (
    <View style={{ flex: 1, justifyContent: "center"}}>
      <VideoView
        player={player}
        style={{ width: "100%", height: 250 }}
        fullscreenOptions={{enable: true}}
        allowsPictureInPicture
      />
    </View>
  );
}