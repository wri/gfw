import lowerCase from 'lodash/lowerCase';
import isEmpty from 'lodash/isEmpty';

import forestTypes from 'data/forest-types.json';
import landCategories from 'data/land-categories.json';

export const getForestTypes = ({ settings, type, polynames, adm0 }) =>
  forestTypes
    .filter(o => {
      const isGlobal = type !== 'global' || o.global;
      const hasPolyname = isEmpty(polynames) || polynames.includes(o.value);
      const isHidden = o.hidden;
      return isGlobal && hasPolyname && !isHidden;
    })
    .map(f => ({
      ...f,
      label: f.label.includes('{iflYear}')
        ? f.label.replace('{iflYear}', settings.ifl)
        : f.label,
      metaKey:
        f.metaKey === 'primary_forest'
          ? `${lowerCase(adm0)}_${f.metaKey}${adm0 === 'IDN' ? 's' : ''}`
          : f.metaKey
    }));

export const getLandCategories = ({ locationType, polynames }) =>
  landCategories.filter(o => {
    const isGlobal = locationType !== 'global' || o.global;
    const hasPolyname = isEmpty(polynames) || polynames.includes(o.value);
    const isHidden = o.hidden;
    return isGlobal && hasPolyname && !isHidden;
  });
