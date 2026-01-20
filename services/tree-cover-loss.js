import { getLossNaturalForest as originalGetLossNaturalForest } from './analysis-cached';
import { getTreeCoverLossAnalytics } from '../utils/gnw-data-request';

export const getLossNaturalForest = async (params) => {
  if (!!params.download === true || params.type !== 'geostore') {
    return originalGetLossNaturalForest(params);
  }

  const { geostore } = params;
  const aoi = { geostore };
  const timespan = { startYear: 2001, endYear: 2024 };
  const canopyCoverThreshold = 0;
  return getTreeCoverLossAnalytics(aoi, timespan, canopyCoverThreshold);
};
