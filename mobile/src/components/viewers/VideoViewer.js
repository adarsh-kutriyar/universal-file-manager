import React, {
  useRef,
  useState,
} from "react";

import {
  View,
  Text,
  TouchableOpacity,
} from "react-native";

import Video from "react-native-video";

export default function VideoViewer({

  path,

  streamUrl,

  fileName,

}) {

  const player =
    useRef(null);

  const [paused, setPaused] =
    useState(false);


  console.log("Playing:", streamUrl);
  return (

    <View
      style={{
        flex: 1,
        backgroundColor: "black",
      }}
    >

      <Video

        ref={player}

        source={{

          uri:

            streamUrl

              ? streamUrl

              : "file://" + path,

        }}

        paused={paused}

        controls

        resizeMode="contain"

        style={{
          flex: 1,
        }}

        onLoad={() =>
          console.log(
            "Video Loaded"
          )
        }

        onError={(error) =>
          console.log(
            "Video Error:",
            error
          )
        }

      />

      <TouchableOpacity

        onPress={() =>
          setPaused(
            !paused
          )
        }

        style={{
          position: "absolute",
          bottom: 40,
          alignSelf: "center",
          padding: 15,
          borderRadius: 10,
          backgroundColor: "#333",
        }}

      >

        <Text
          style={{
            color: "white",
          }}
        >

          {paused
            ? "▶ Play"
            : "⏸ Pause"}

        </Text>

      </TouchableOpacity>

    </View>

  );

}