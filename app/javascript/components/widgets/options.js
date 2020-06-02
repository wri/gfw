import forestType from 'data/forest-types';
import landCategory from 'data/land-categories';
import threshold from 'data/thresholds.json';
import unit from 'data/units.json';
import variable from 'data/variables.json';
import period from 'data/periods.json';
import extentYear from 'data/extent-years.json';
import tscDriverGroup from 'data/tsc-loss-groups.json';
import type from 'data/types.json';
import weeks from 'data/weeks.json';
import dataset from 'data/datasets.json';
import confidence from 'data/confidence.json';
import bioTypes from 'data/biodiversity-int.json';
import ifl from 'data/ifl.json';
import source from 'data/sources.json';

export default {
  forestType: forestType.filter(f => !f.hidden),
  landCategory: landCategory.filter(l => !l.hidden),
  threshold,
  unit,
  period,
  extentYear,
  tscDriverGroup,
  type,
  bioTypes,
  weeks,
  dataset,
  confidence,
  variable,
  source,
  ifl
};
