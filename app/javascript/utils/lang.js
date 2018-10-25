export const getLanguages = () => {
  const txData = JSON.parse(localStorage.getItem('txlive:languages'));
  return (
    txData &&
    txData.source &&
    [txData.source].concat(txData.translation).map(l => ({
      label: l.name,
      value: l.code
    }))
  );
};
