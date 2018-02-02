import { createElement, PureComponent } from 'react';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';
import isEqual from 'lodash/isEqual';

import actions from './widget-tree-cover-plantations-actions';
import reducers, {
  initialState
} from './widget-tree-cover-plantations-reducers';
import {
  getTreeCoverPlantationsData,
  getSentence
} from './widget-tree-cover-plantations-selectors';
import WidgetTreeCoverPlantationsComponent from './widget-tree-cover-plantations-component';

const mapStateToProps = (
  { widgetTreeCoverPlantations, countryData },
  ownProps
) => {
  const {
    isCountriesLoading,
    isRegionsLoading,
    countryWhitelist,
    regions
  } = countryData;
  const { settings, loading, data } = widgetTreeCoverPlantations;
  const { colors, locationNames, activeIndicator } = ownProps;
  const selectorData = {
    data,
    settings,
    whitelist: countryWhitelist,
    locationNames,
    activeIndicator,
    colors: {
      ...colors.types,
      ...colors.species
    }
  };

  return {
    loading: loading || isCountriesLoading || isRegionsLoading,
    regions,
    data,
    parsedData: getTreeCoverPlantationsData(selectorData),
    sentence: getSentence(selectorData)
  };
};

class WidgetTreeCoverPlantationsContainer extends PureComponent {
  componentDidMount() {
    const { location, settings, getTreeCoverPlantations } = this.props;
    getTreeCoverPlantations({
      ...location,
      ...settings
    });
  }

  componentWillReceiveProps(nextProps) {
    const { settings, getTreeCoverPlantations, location } = nextProps;

    if (
      !isEqual(location, this.props.location) ||
      !isEqual(settings, this.props.settings)
    ) {
      getTreeCoverPlantations({
        ...location,
        ...settings
      });
    }
  }

  render() {
    return createElement(WidgetTreeCoverPlantationsComponent, {
      ...this.props
    });
  }
}

WidgetTreeCoverPlantationsContainer.propTypes = {
  settings: PropTypes.object.isRequired,
  location: PropTypes.object.isRequired,
  getTreeCoverPlantations: PropTypes.func.isRequired
};

export { actions, reducers, initialState };

export default connect(mapStateToProps, actions)(
  WidgetTreeCoverPlantationsContainer
);
