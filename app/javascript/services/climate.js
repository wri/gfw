import request from 'utils/request';

const REQUEST_URL =
  'http://climate.globalforestwatch.org/api/indicators/{indicator}?thresh={thresh}&iso={iso}&id_1={id}&area={area}';

const INDICATORS = [
  3110, // (Carbon) Young Secondary Forest
  3111, // (Carbon) Mid-Age Secondary Forests
  3112, // (Carbon) Pasture
  3113, // (Carbon) Crops
  3114, // C02 Young Secondary Forest
  3115, // C02 Mid-Age Secondary Forests
  3116, // C02 Pasture
  3117 // C02 Crops
];

export const getEmissions = ({ threshold, adm0, adm1, adm2 }) =>
  INDICATORS.map(indicator => {
    const url = REQUEST_URL.replace('{indicator}', indicator)
      .replace('{thresh}', threshold || '0')
      .replace('{iso}', adm0 ? String(adm0) : '')
      .replace('{id}', adm1 ? String(adm1) : '')
      .replace('{area}', adm2 ? String(adm1) : '');
    return request.get(url);
  });
