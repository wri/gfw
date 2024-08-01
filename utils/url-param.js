const encode = (param) => {
  return btoa(JSON.stringify(param));
};

const decode = (param) => {
  // we use Buffer as atob is node native to node for SSR
  return JSON.parse(Buffer.from(param, 'base64').toString('binary'));
};

const urlParam = {
  encode,
  decode
};

export default urlParam;
