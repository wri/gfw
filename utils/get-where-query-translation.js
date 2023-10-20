export const translateParameterKey = (parameterKey, { type, dataset }) => {
  let paramKey = '';

  if (parameterKey === 'confidence') paramKey = 'confidence__cat';
  if (parameterKey === 'adm0' && type === 'country') paramKey = 'iso';
  if (parameterKey === 'adm1' && type === 'country') paramKey = 'adm1';
  if (parameterKey === 'adm2' && type === 'country') paramKey = 'adm2';
  if (parameterKey === 'adm0' && type === 'geostore') paramKey = 'geostore__id';
  if (parameterKey === 'adm0' && type === 'wdpa')
    paramKey = 'wdpa_protected_area__id';

  if (parameterKey === 'threshold') {
    if (dataset === 'tropicalTreeCover') {
      paramKey = 'wri_tropical_tree_cover__decile';
    } else {
      paramKey = 'umd_tree_cover_density_2000__threshold';
    }
  }

  return paramKey;
};

export default translateParameterKey;
