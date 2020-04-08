const isAreaComputed = status => status === 'saved';
const isGlobalArea = type => type === 'global';
const isCountryArea = type => type === 'country';

export const shouldQueryPrecomputedTables = params =>
  isAreaComputed(params.status) ||
  isGlobalArea(params.type) ||
  isCountryArea(params.type);
