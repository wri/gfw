const isAreaComputed = (status) => status === 'saved';
const isGlobalArea = (type) => type === 'global';
const isCountryArea = (type) => type === 'country';
const isWdpaArea = (type) => type === 'wdpa';

export const shouldQueryPrecomputedTables = (params) =>
  isAreaComputed(params.status) ||
  isGlobalArea(params.type) ||
  isCountryArea(params.type) ||
  isWdpaArea(params.type);
