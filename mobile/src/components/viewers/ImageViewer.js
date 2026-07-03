import React from "react";

import {
  View,
  Image,
} from "react-native";

export default function ImageViewer({
  path,
}) {

  return (

    <View
      style={{
        flex: 1,
        backgroundColor: "black",
        justifyContent: "center",
      }}
    >

      <Image
        source={{
          uri: "file://" + path,
        }}
        style={{
          width: "100%",
          height: "100%",
        }}
        resizeMode="contain"
      />

    </View>

  );

}