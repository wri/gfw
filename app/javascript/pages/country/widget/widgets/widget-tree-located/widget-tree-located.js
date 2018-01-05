import { createElement, PureComponent } from 'react';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';
import isEqual from 'lodash/isEqual';

import actions from './widget-tree-located-actions';
import reducers, { initialState } from './widget-tree-located-reducers';
import { getSortedData } from './widget-tree-located-selectors';
import WidgetTreeLocatedComponent from './widget-tree-located-component';

const mapStateToProps = ({ location, widgetTreeLocated, countryData }) => {
  const { isCountriesLoading, isRegionsLoading } = countryData;
  const data = {
    data: widgetTreeLocated.data.regions,
    unit: widgetTreeLocated.settings.unit,
    meta: countryData[!location.payload.region ? 'regions' : 'subRegions'],
    location: location.payload
  };
  return {
    regions: countryData.regions,
    loading:
      widgetTreeLocated.loading || isCountriesLoading || isRegionsLoading,
    data: getSortedData(data) || []
  };
};

class WidgetTreeLocatedContainer extends PureComponent {
  componentWillMount() {
    const { location, settings, getTreeLocated } = this.props;
    getTreeLocated({
      ...location,
      ...settings
    });
  }

  componentWillReceiveProps(nextProps) {
    const { settings, location, getTreeLocated } = nextProps;

    if (
      !isEqual(location.country, this.props.location.country) ||
      !isEqual(location.region, this.props.location.region) ||
      !isEqual(settings.indicator, this.props.settings.indicator) ||
      !isEqual(settings.threshold, this.props.settings.threshold)
    ) {
      getTreeLocated({
        ...location,
        ...settings
      });
    }
  }

  handlePageChange = change => {
    const { setTreeLocatedPage, settings } = this.props;
    setTreeLocatedPage(settings.page + change);
  };

  render() {
    return createElement(WidgetTreeLocatedComponent, {
      ...this.props,
      handlePageChange: this.handlePageChange
    });
  }
}

WidgetTreeLocatedContainer.propTypes = {
  setTreeLocatedPage: PropTypes.func.isRequired,
  settings: PropTypes.object.isRequired,
  location: PropTypes.object.isRequired,
  getTreeLocated: PropTypes.func.isRequired
};

export { actions, reducers, initialState };

export default connect(mapStateToProps, actions)(WidgetTreeLocatedContainer);
