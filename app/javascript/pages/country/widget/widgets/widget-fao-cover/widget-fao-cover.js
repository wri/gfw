import { createElement, PureComponent } from 'react';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';
import isEqual from 'lodash/isEqual';
import { format } from 'd3-format';

import actions from './widget-fao-cover-actions';
import reducers, { initialState } from './widget-fao-cover-reducers';
import { getFAOCoverData } from './widget-fao-cover-selectors';
import WidgetFAOCoverComponent from './widget-fao-cover-component';

const mapStateToProps = ({ widgetFAOCover }, ownProps) => {
  const { fao, rank } = widgetFAOCover.data;
  return {
    loading: widgetFAOCover.loading || ownProps.isMetaLoading,
    fao,
    rank,
    data:
      getFAOCoverData({ fao, rank, locationNames: ownProps.locationNames }) ||
      {}
  };
};

class WidgetFAOCoverContainer extends PureComponent {
  componentWillMount() {
    const { location, getFAOCover } = this.props;
    getFAOCover({ ...location });
  }

  componentWillReceiveProps(nextProps) {
    const { location, getFAOCover } = nextProps;

    if (!isEqual(location, this.props.location)) {
      getFAOCover({ ...location });
    }
  }

  getSentence = () => {
    const {
      locationNames,
      fao: {
        area_ha,
        extent,
        forest_planted,
        forest_primary,
        forest_regenerated
      },
      rank
    } = this.props;

    const naturallyRegenerated = extent / 100 * forest_regenerated;
    const primaryForest = extent / 100 * forest_primary;
    const plantedForest = extent / 100 * forest_planted;
    const nonForest =
      area_ha - (naturallyRegenerated + primaryForest + plantedForest);

    const sentence = `FAO data from 2015 shows that ${locationNames.current &&
      locationNames.current.label} is ${
      nonForest / area_ha > 0.5 ? 'mostly non-forest.' : 'mostly forest.'
    }${
      primaryForest > 0
        ? ` Primary forest occupies <strong>${format('.1f')(
          primaryForest / area_ha * 100
        )}%</strong> of the country. This gives ${locationNames.current &&
            locationNames.current
              .label} a rank of <strong>${rank}th</strong> out of 110 countries in terms of its relative amount of primary forest.`
        : ''
    }`;
    return sentence;
  };

  render() {
    return createElement(WidgetFAOCoverComponent, {
      ...this.props,
      getSentence: this.getSentence
    });
  }
}

WidgetFAOCoverContainer.propTypes = {
  location: PropTypes.object.isRequired,
  locationNames: PropTypes.object.isRequired,
  fao: PropTypes.object.isRequired,
  rank: PropTypes.number.isRequired,
  getFAOCover: PropTypes.func.isRequired
};

export { actions, reducers, initialState };

export default connect(mapStateToProps, actions)(WidgetFAOCoverContainer);
