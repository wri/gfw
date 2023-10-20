import ALLOWED_PARAMS from 'utils/get-where-query-allowed-params';
import { translateParameterKey } from 'utils/get-where-query-translation';

import forestTypes from 'data/forest-types';
import landCategories from 'data/land-categories';

const isNumber = (value) => !!(typeof value === 'number' || !isNaN(value));

// build {where} statement for query
export const getWHEREQuery = (params = {}) => {
  const { type, dataset } = params || {};

  const allFilterOptions = forestTypes.concat(landCategories);
  const allowedParams = ALLOWED_PARAMS[params.dataset || 'annual'];
  const isTreeCoverDensity = dataset === 'treeCoverDensity';
  const comparisonString = ' = ';

  let paramString = 'WHERE ';
  let paramKeys = Object.keys(params).filter((parameterName) => {
    return (
      (params[parameterName] || parameterName === 'threshold') &&
      allowedParams.includes(parameterName)
    );
  });

  if (!paramKeys?.length) {
    return '';
  }

  /*
   * Removing threshold from Tree Cover Density request
   * Tree Cover Density has a default threshold >=10
   */
  if (isTreeCoverDensity && paramKeys.includes('threshold')) {
    paramKeys = paramKeys.filter((item) => item !== 'threshold');
  }

  paramKeys.forEach((parameter, index) => {
    const isLastParameter = paramKeys.length - 1 === index;
    const hasFilterOption = ['forestType', 'landCategory'].includes(parameter);
    const value = hasFilterOption ? 1 : params[parameter];
    const polynameMeta = allFilterOptions.find(
      (pname) => pname.value === params[parameter]
    );
    const tableKey =
      polynameMeta &&
      (polynameMeta.tableKey || polynameMeta.tableKeys[dataset || 'annual']);
    let isNumericValue = isNumber(value);

    const paramKey = translateParameterKey(parameter, params);

    if (parameter === 'adm0' && type === 'wdpa') {
      isNumericValue = false;
    }

    if (dataset === 'net_change') {
      isNumericValue = false;
    }

    const hasPrefixIs__ = hasFilterOption && tableKey.includes('is__');
    let WHERE = '';

    if (hasFilterOption) {
      if (hasPrefixIs__) {
        WHERE = `${WHERE}${tableKey} = 'true'`;
      }

      if (!hasPrefixIs__) {
        WHERE = `${WHERE}${tableKey} IS NOT NULL`;
      }

      if (
        polynameMeta &&
        !hasPrefixIs__ &&
        polynameMeta.default &&
        polynameMeta.categories
      ) {
        WHERE = `${WHERE} AND ${tableKey} ${polynameMeta.comparison || '='} ${
          polynameMeta?.dataType === 'keyword'
            ? `'${polynameMeta?.default}'`
            : `${polynameMeta?.default}`
        }`;
      }
    }

    if (!hasFilterOption) {
      WHERE = `${WHERE}${paramKey}${comparisonString}${
        isNumericValue ? value : `'${value}'`
      }`;
    }

    if (isLastParameter) {
      WHERE = `${WHERE} `;
    } else {
      WHERE = `${WHERE} AND `;
    }

    paramString = paramString.concat(WHERE);
  });

  return paramString;
};
