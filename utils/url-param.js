// We encode url params into Base64 to add them to the URL by using window.btoa().
// However, this method can fail if the string being encoded includes characters
// outside of the Latin1 alphabet. Eg: "Bình Thuận".
// This file offers a couple utilities to encode and decode a param, by first encoding
// it with the use of TextEncoder(), and reversing it when decoding with the use of
// TextDecoder(). This is the solution advised by the MDN web docs.
// See: https://developer.mozilla.org/en-US/docs/Glossary/Base64#the_unicode_problem

const base64ToBytes = (base64) => {
  // we use Buffer as atob() is a window method, and we may be decoding the param
  // server side.
  const binString = Buffer.from(base64, 'base64').toString('binary');
  return Uint8Array.from(binString, (m) => m.codePointAt(0));
};

const bytesToBase64 = (bytes) => {
  const binString = Array.from(bytes, (byte) =>
    String.fromCodePoint(byte)
  ).join('');
  return btoa(binString);
};

// Decode an URL param according to the suggestion presented in the MDN web docs.
const decode = (param) => {
  const base64DecodedParam = base64ToBytes(param);
  const textDecodedParam = new TextDecoder().decode(base64DecodedParam);
  const parsedStringifiedParam = JSON.parse(textDecodedParam);
  return parsedStringifiedParam;
};

// Encode an URL param according to the suggestion presented in the MDN web docs.
const encode = (param) => {
  const stringifiedParam = JSON.stringify(param);
  const textEncodedParam = new TextEncoder().encode(stringifiedParam);
  const base64EncodedParam = bytesToBase64(textEncodedParam);
  return base64EncodedParam;
};

const urlParam = {
  encode,
  decode,
};

export default urlParam;
