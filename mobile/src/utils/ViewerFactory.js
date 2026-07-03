import React from "react";

import ImageViewer from "../components/viewers/ImageViewer";
import VideoViewer from "../components/viewers/VideoViewer";
import UnsupportedViewer from "../components/viewers/UnsupportedViewer";

export function getViewer({

  fileName,

  localPath,

  streamUrl,

}) {

  const extension =
    fileName
      .split(".")
      .pop()
      .toLowerCase();

  const imageExtensions = [

    "jpg",
    "jpeg",
    "png",
    "gif",
    "bmp",
    "webp",

  ];

  const videoExtensions = [

    "mp4",
    "mkv",
    "mov",
    "avi",
    "webm",
    "m4v",

  ];

  if (

    imageExtensions.includes(
      extension
    )

  ) {

    return (

      <ImageViewer
        path={localPath}
      />

    );

  }

  if (

    videoExtensions.includes(
      extension
    )

  ) {

    return (

      <VideoViewer

        path={localPath}

        streamUrl={streamUrl}

        fileName={fileName}

      />

    );

  }

  return (

    <UnsupportedViewer
      fileName={fileName}
    />

  );

}