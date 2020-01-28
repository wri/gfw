import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { formatNumber } from 'utils/format';
import { translateText } from 'utils/transifex';

import DynamicSentence from 'components/ui/dynamic-sentence';

import './styles.scss';

class BoundarySentence extends Component {
  handleSetAnalysisView = () => {
    const { onSelectBoundary, selected, data } = this.props;
    onSelectBoundary({
      ...selected,
      data: { ...data, level: data.level - 1 }
    });
  };

  render() {
    const { data } = this.props;
    let name = data[`name_${data.level}`];
    if (!data.gid_0) {
      name = data[Object.keys(data).find(k => k.includes('name'))];
    }
    const area = data[Object.keys(data).find(k => k.includes('area'))];
    const locationNameTranslated = translateText(name);

    let locationNames = [locationNameTranslated];

    if (data.level === 2) {
      locationNames = [
        locationNameTranslated,
        translateText(data.name_1),
        translateText(data.name_0)
      ];
    } else if (data.level === 1) {
      locationNames = [locationNameTranslated, translateText(data.name_0)];
    }

    const locationName = locationNames.join(', ');

    const params = {
      location: locationName,
      area: formatNumber({ num: area, unit: 'ha' })
    };

    const sentence = translateText('{location}, with a total area of {area}');

    return (
      <DynamicSentence
        className="c-boundary-sentence"
        sentence={{
          sentence,
          params
        }}
      />
    );
  }
}

BoundarySentence.propTypes = {
  data: PropTypes.oneOfType([PropTypes.array, PropTypes.object]),
  onSelectBoundary: PropTypes.func,
  selected: PropTypes.object
};

export default BoundarySentence;
