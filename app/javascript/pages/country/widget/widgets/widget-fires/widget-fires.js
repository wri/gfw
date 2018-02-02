import { createElement, PureComponent } from 'react';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';
import isEqual from 'lodash/isEqual';

import actions from './widget-fires-actions';
import reducers, { initialState } from './widget-fires-reducers';
import {
  getSortedData,
  chartConfig,
  getSentence
} from './widget-fires-selectors';
import WidgetFiresComponent from './widget-fires-component';

const mapStateToProps = ({ widgetFires, countryData }, ownProps) => {
  const { data } = widgetFires;
  const { geostore } = countryData;
  const { locationNames } = ownProps;
  const selectorData = {
    data,
    locationNames,
    colors: ownProps.colors
  };

  return {
    chartData: getSortedData(selectorData),
    chartConfig: chartConfig(selectorData),
    sentence: getSentence(selectorData),
    geostore: geostore.hash
  };
};

class WidgetFiresContainer extends PureComponent {
  componentWillMount() {
    const { location, settings, geostore, getFiresData } = this.props;
    if (geostore !== '') {
      getFiresData({ ...location, ...settings, geostore });
    }
  }

  componentWillReceiveProps(nextProps) {
    const { location, settings, geostore, getFiresData } = nextProps;
    if (
      !isEqual(location.country, this.props.location.country) ||
      geostore !== this.props.geostore
    ) {
      getFiresData({ ...location, ...settings, geostore });
    }
  }

  render() {
    return createElement(WidgetFiresComponent, {
      ...this.props
    });
  }
}

WidgetFiresContainer.propTypes = {
  location: PropTypes.object.isRequired,
  settings: PropTypes.object.isRequired,
  geostore: PropTypes.string.isRequired,
  getFiresData: PropTypes.func.isRequired
};

export { actions, reducers, initialState };

export default connect(mapStateToProps, actions)(WidgetFiresContainer);
