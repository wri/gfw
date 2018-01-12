import { createElement, PureComponent } from 'react';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';
import isEqual from 'lodash/isEqual';
import { getIndicatorLabel } from 'pages/country/widget/widget-selectors';

import actions from './widget-tree-cover-actions';
import reducers, { initialState } from './widget-tree-cover-reducers';
import { getTreeCoverData } from './widget-tree-cover-selectors';
import WidgetTreeCoverComponent from './widget-tree-cover-component';

const mapStateToProps = ({ widgetTreeCover, countryData }) => {
  const { isCountriesLoading, isRegionsLoading, whitelist } = countryData;
  const { data } = widgetTreeCover;
  const { indicator } = widgetTreeCover.settings;

  return {
    loading: widgetTreeCover.loading || isCountriesLoading || isRegionsLoading,
    regions: countryData.regions,
    data: widgetTreeCover.data,
    parsedData: getTreeCoverData({
      data,
      indicator,
      whitelist
    })
  };
};

class WidgetTreeCoverContainer extends PureComponent {
  componentDidMount() {
    const { location, settings, getTreeCover } = this.props;
    getTreeCover({
      ...location,
      ...settings
    });
  }

  componentWillReceiveProps(nextProps) {
    const { settings, getTreeCover, location } = nextProps;

    if (
      !isEqual(location, this.props.location) ||
      !isEqual(settings, this.props.settings)
    ) {
      getTreeCover({
        ...location,
        ...settings
      });
    }
  }

  getSentence = () => {
    const { locationNames, settings } = this.props;
    const { indicators } = this.props.options;
    const { totalArea, cover } = this.props.data;
    const indicator = getIndicatorLabel(settings.indicator, indicators);
    const coverStatus = cover / totalArea > 0.5 ? 'tree covered' : 'non-forest';
    const first = `<b>${
      locationNames.current.label
    } (${indicator})</b> is mainly ${coverStatus}, `;
    const second = `considering tree cover extent in <b>${
      settings.extentYear
    }</b> where tree canopy is greater than <b>${settings.threshold}%</b>`;

    return `${first} ${second}`;
  };

  render() {
    return createElement(WidgetTreeCoverComponent, {
      ...this.props,
      getSentence: this.getSentence
    });
  }
}

WidgetTreeCoverContainer.propTypes = {
  settings: PropTypes.object.isRequired,
  location: PropTypes.object.isRequired,
  locationNames: PropTypes.object.isRequired,
  getTreeCover: PropTypes.func.isRequired,
  options: PropTypes.object.isRequired,
  data: PropTypes.object.isRequired
};

export { actions, reducers, initialState };

export default connect(mapStateToProps, actions)(WidgetTreeCoverContainer);
