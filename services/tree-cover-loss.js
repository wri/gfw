import { getLossNaturalForest as originalGetLossNaturalForest } from './analysis-cached';
import { getTreeCoverLossAnalytics } from '../utils/gnw-data-request';

export const getLossNaturalForest = (params) => {
  if (!!params.download === true || params.type !== 'country') {
    return originalGetLossNaturalForest(params);
  }
  // TODO: destructure params to pass only necessary ones to the new service
  return getTreeCoverLossAnalytics(params);
};
