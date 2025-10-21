import { connect } from 'react-redux';

import Component from './component';

import config from './config';

const mapStateToProps = (
  { countryData },
  { type, isos, statement, dataset }
) => {
  const conf =
    dataset === 'landmark' || dataset === 'landmark_points'
      ? config.landmarkLayer
      : config[type];

  return {
    statementPlain: statement,
    ...conf,
    ...(!!isos &&
      !dataset.includes('landmark') && {
        tooltipDesc:
          countryData &&
          countryData.countries &&
          countryData.countries
            .filter((c) => isos.includes(c.value))
            .map((c) => c.label)
            .join(', '),
      }),
    tooltipClassname: `statement-tooltip-text-${type}`,
  };
};

export default connect(mapStateToProps, null)(Component);
