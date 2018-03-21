import { createElement, PureComponent } from 'react';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';
import isEqual from 'lodash/isEqual';

import actions from './widget-tree-cover-ranked-actions';
import reducers, { initialState } from './widget-tree-cover-ranked-reducers';
import {
  getFilteredData,
  getSentence
} from './widget-tree-cover-ranked-selectors';
import WidgetTreeCoverRankedComponent from './widget-tree-cover-ranked-component';

const mapStateToProps = (
  { location, widgetTreeCoverRanked, countryData },
  ownProps
) => {
  const { colors, locationNames, activeIndicator } = ownProps;
  const { data: { extent }, settings } = widgetTreeCoverRanked;
  let meta = countryData.countries;
  if (location.payload.subRegion) {
    meta = countryData.subRegions;
  } else if (location.payload.region) {
    meta = countryData.regions;
  }

  const selectorData = {
    data: extent,
    settings,
    location: location.payload,
    meta,
    colors,
    indicator: activeIndicator,
    locationNames
  };

  return {
    data: getFilteredData(selectorData),
    sentence: getSentence(selectorData)
  };
};

class WidgetTreeCoverRankedContainer extends PureComponent {
  componentWillMount() {
    const { settings, getTreeCoverRanked } = this.props;
    getTreeCoverRanked({
      ...settings
    });
  }

  componentWillReceiveProps(nextProps) {
    const { settings, getTreeCoverRanked } = nextProps;
    if (
      !isEqual(settings.indicator, this.props.settings.indicator) ||
      !isEqual(settings.threshold, this.props.settings.threshold) ||
      !isEqual(settings.extentYear, this.props.settings.extentYear)
    ) {
      getTreeCoverRanked({
        ...settings
      });
    }
  }

  render() {
    return createElement(WidgetTreeCoverRankedComponent, {
      ...this.props,
      getSentence: this.getSentence
    });
  }
}

WidgetTreeCoverRankedContainer.propTypes = {
  settings: PropTypes.object.isRequired,
  getTreeCoverRanked: PropTypes.func.isRequired
};

export { actions, reducers, initialState };

export default connect(mapStateToProps, actions)(
  WidgetTreeCoverRankedContainer
);
