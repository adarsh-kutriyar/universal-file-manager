const downloadTokens = {};

export function createToken(
  token,
  filePath
) {

  downloadTokens[token] =
    filePath;

}

export function getFilePath(
  token
) {

  return downloadTokens[token];

}

export function deleteToken(
  token
) {

  delete downloadTokens[token];

}