const base64ToBytes = (base64) => {
  const binString = Buffer.from(base64, 'base64').toString('binary');
  return Uint8Array.from(binString, (m) => m.codePointAt(0));
};

const bytesToBase64 = (bytes) => {
  const binString = Array.from(bytes, (byte) => String.fromCodePoint(byte)).join('');
  return btoa(binString);
};

const decode = (param) => {
  const base64DecodedParam = base64ToBytes(param);
  const textDecodedParam = new TextDecoder().decode(base64DecodedParam);
  const parsedStringifiedParam = JSON.parse(textDecodedParam);
  return parsedStringifiedParam;
};

const encode = (param) => {
  const stringifiedParam = JSON.stringify(param);
  const textEncodedParam = new TextEncoder().encode(stringifiedParam);
  const base64EncodedParam = bytesToBase64(textEncodedParam);
  return base64EncodedParam;
};

const urlParam = {
  encode,
  decode
};

export default urlParam;
