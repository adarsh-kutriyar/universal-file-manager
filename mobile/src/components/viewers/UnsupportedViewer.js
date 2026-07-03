import React from "react";

import {
  View,
  Text,
} from "react-native";

export default function UnsupportedViewer({

  fileName,

}) {

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
          fontSize: 24,
          marginBottom: 20,
        }}
      >
        Unsupported File
      </Text>

      <Text>

        {fileName}

      </Text>

    </View>

  );

}