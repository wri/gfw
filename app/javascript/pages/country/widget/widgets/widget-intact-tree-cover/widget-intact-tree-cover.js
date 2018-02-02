import { createElement, PureComponent } from 'react';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';
import isEqual from 'lodash/isEqual';

import actions from './widget-intact-tree-cover-actions';
import reducers, { initialState } from './widget-intact-tree-cover-reducers';
import {
  getIntactTreeCoverData,
  getSentence
} from './widget-intact-tree-cover-selectors';
import WidgetIntactTreeCoverComponent from './widget-intact-tree-cover-component';

const mapStateToProps = ({ widgetIntactTreeCover, countryData }, ownProps) => {
  const {
    isCountriesLoading,
    isRegionsLoading,
    countryWhitelist,
    regions
  } = countryData;
  const { settings, loading, data } = widgetIntactTreeCover;
  const { locationNames, activeIndicator } = ownProps;
  const selectorData = {
    data,
    settings,
    whitelist: countryWhitelist,
    locationNames,
    activeIndicator,
    colors: ownProps.colors
  };

  return {
    loading: loading || isCountriesLoading || isRegionsLoading,
    regions,
    data,
    parsedData: getIntactTreeCoverData(selectorData),
    sentence: getSentence(selectorData)
  };
};

class WidgetIntactTreeCoverContainer extends PureComponent {
  componentDidMount() {
    const { location, settings, getIntactTreeCover } = this.props;
    getIntactTreeCover({
      ...location,
      ...settings
    });
  }

  componentWillReceiveProps(nextProps) {
    const { settings, getIntactTreeCover, location } = nextProps;

    if (
      !isEqual(location, this.props.location) ||
      !isEqual(settings, this.props.settings)
    ) {
      getIntactTreeCover({
        ...location,
        ...settings
      });
    }
  }

  render() {
    return createElement(WidgetIntactTreeCoverComponent, {
      ...this.props
    });
  }
}

WidgetIntactTreeCoverContainer.propTypes = {
  settings: PropTypes.object.isRequired,
  location: PropTypes.object.isRequired,
  getIntactTreeCover: PropTypes.func.isRequired
};

export { actions, reducers, initialState };

export default connect(mapStateToProps, actions)(
  WidgetIntactTreeCoverContainer
);
