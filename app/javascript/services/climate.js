import request from 'utils/request';

const REQUEST_URL =
  'http://climate.globalforestwatch.org/api/indicators/{indicator}?thresh={thresh}&iso={iso}&id_1={id}&area={area}';

const INDICATORS = {
  // Teragrams of Carbon
  C: {
    // Young Secondary Forest
    YSF: 3110,
    // Mid-Age Secondary Forests
    MASF: 3111,
    Pasture: 3112,
    Crops: 3113
  },
  // Million Tons of C02
  C02: {
    YSF: 3114,
    MASF: 3115,
    Pasture: 3116,
    Crops: 3117
  }
};

export const getEmissions = ({ variable, threshold, adm0, adm1, adm2 }) =>
  Object.keys(INDICATORS[variable]).map(forestType => {
    const url = REQUEST_URL.replace(
      '{indicator}',
      INDICATORS[variable][forestType]
    )
      .replace('{thresh}', threshold)
      .replace('{iso}', adm0 ? String(adm0) : '')
      .replace('{id}', adm1 ? String(adm1) : '')
      .replace('{area}', adm2 ? String(adm1) : '');
    return request.get(url);
  });
