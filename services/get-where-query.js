import ALLOWED_PARAMS from 'utils/get-where-query-allowed-params';
import { translateParameterKey } from 'utils/get-where-query-translation';

import forestTypes from 'data/forest-types';
import landCategories from 'data/land-categories';

const isNumber = (value) => !!(typeof value === 'number' || !isNaN(value));

// build {where} statement for query
export const getWHEREQuery = (params = {}) => {
  // umd_tree_cover_loss__year is being added for the dashboard sentences for natural forest
  const { type, dataset, umd_tree_cover_loss__year, isNaturalForest } =
    params || {};

  const allFilterOptions = forestTypes.concat(landCategories);
  const allowedParams = ALLOWED_PARAMS[params.dataset || 'annual'];
  const isTreeCoverDensity = dataset === 'treeCoverDensity';
  const isVIIRS = dataset === 'viirs';
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

  /*
   * Removing confidence_cat = 'false' from VIIRS request
   * if the user selects 'all alerts' on the VIIRS layer,
   * we don't want to add a new parameter to the query
   */
  if (isVIIRS && !params?.confidenceToggle === 'false') {
    paramKeys = paramKeys.filter((item) => item !== 'confidence');
  }

  paramKeys.forEach((parameter, index) => {
    const isLastParameter = paramKeys.length - 1 === index;
    const hasFilterOption = ['forestType', 'landCategory'].includes(parameter);
    const value = hasFilterOption ? 1 : params[parameter];
    const filterOption = allFilterOptions.find(
      (pname) => pname.value === params[parameter]
    );

    const tableKey =
      filterOption &&
      (filterOption.tableKey || filterOption.tableKeys[dataset || 'annual']);

    let isNumericValue = isNumber(value);

    const paramKey = translateParameterKey(parameter, params);

    if ((parameter === 'adm0' && type === 'wdpa') || dataset === 'net_change') {
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
        filterOption &&
        !hasPrefixIs__ &&
        filterOption.default &&
        filterOption.categories
      ) {
        WHERE = `${WHERE} AND ${tableKey} ${filterOption.comparison || '='} ${
          filterOption?.dataType === 'keyword'
            ? `'${filterOption?.default}'`
            : `${filterOption?.default}`
        }`;
      }
    }

    if (!hasFilterOption) {
      WHERE = `${WHERE}${paramKey}${comparisonString}${
        isNumericValue ? value : `'${value}'`
      }`;
    }

    if (isLastParameter) {
      if (isNaturalForest) {
        WHERE = `${WHERE} AND umd_tree_cover_loss__year=${umd_tree_cover_loss__year}`;
      } else {
        WHERE = `${WHERE} `;
      }
    } else {
      WHERE = `${WHERE} AND `;
    }

    paramString = paramString.concat(WHERE);
  });

  return paramString;
};
