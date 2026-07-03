import React, { useRef, useState } from "react";

import {
  View,
  Text,
  TouchableOpacity,
} from "react-native";

import Video from "react-native-video";

export default function AudioViewer({

  path,
  fileName,

}) {

  const player =
    useRef(null);

  const [paused, setPaused] =
    useState(true);

  return (

    <View
      style={{
        flex: 1,
        justifyContent: "center",
        alignItems: "center",
        padding: 20,
      }}
    >

      <Text
        style={{
          fontSize: 22,
          marginBottom: 40,
        }}
      >

        🎵 {fileName}

      </Text>

      <Video

        ref={player}

        source={{
          uri: "file://" + path,
        }}

        audioOnly

        paused={paused}

        style={{
          width: 0,
          height: 0,
        }}

      />

      <TouchableOpacity

        onPress={() =>

          setPaused(
            !paused
          )

        }

        style={{
          padding: 20,
          borderWidth: 1,
          borderRadius: 10,
        }}

      >

        <Text>

          {paused
            ? "▶ Play"
            : "⏸ Pause"}

        </Text>

      </TouchableOpacity>

    </View>

  );

}