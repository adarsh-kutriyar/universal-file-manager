import fs from "fs";
import path from "path";
import os from "os";

export function listRootFolders() {

  const home =
    os.homedir();

  return fs
    .readdirSync(
      home,
      {
        withFileTypes: true,
      }
    )
    .filter(
      item =>
        item.isDirectory()
    )
    .map(
      item => ({
        name: item.name,
        path: path.join(
          home,
          item.name
        ),
        isDirectory: true,
      })
    );

}

export function listFolder(
  folderPath
) {

  return fs
    .readdirSync(
      folderPath,
      {
        withFileTypes: true,
      }
    )
    .map(
      item => ({
        name: item.name,
        path: path.join(
          folderPath,
          item.name
        ),
        isDirectory:
          item.isDirectory(),
      })
    );

}