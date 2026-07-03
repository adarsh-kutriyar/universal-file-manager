import React from "react";

import Pdf from "react-native-pdf";

import {
  View,
} from "react-native";

export default function PdfViewer({

  path,

}) {

  return (

    <View
      style={{
        flex: 1,
      }}
    >

      <Pdf

        source={{
          uri: "file://" + path,
        }}

        style={{
          flex: 1,
        }}

      />

    </View>

  );

}