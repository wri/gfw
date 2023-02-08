export const htmlParser = (html) => {
  return html.replace(/(<([^>]+)>)/gi, '');
};
