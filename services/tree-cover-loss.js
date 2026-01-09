import { getLossNaturalForest as originalGetLossNaturalForest } from './analysis-cached';
import { getTreeCoverLossAnalytics } from '../utils/gnw-data-request';

export const getLossNaturalForest = async (params) => {
  if (!!params.download === true || params.type !== 'country') {
    return originalGetLossNaturalForest(params);
  }

  const { adm0, adm1, adm2 } = params;
  const aoi = { adm0, adm1, adm2 };
  const timespan = { startYear: 2001, endYear: 2024 };
  const canopyCoverThreshold = 0;
  return getTreeCoverLossAnalytics(aoi, timespan, canopyCoverThreshold);
};
