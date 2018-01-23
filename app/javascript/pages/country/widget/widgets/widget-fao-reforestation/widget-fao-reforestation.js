import { createElement, PureComponent } from 'react';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';
import isEqual from 'lodash/isEqual';
import COLORS from 'pages/country/data/colors.json';

import actions from './widget-fao-reforestation-actions';
import reducers, { initialState } from './widget-fao-reforestation-reducers';
import WidgetFAOReforestationComponent from './widget-fao-reforestation-component';
import {
  getFilteredData,
  getSentence
} from './widget-fao-reforestation-selectors';

const mapStateToProps = ({ widgetFAOReforestation, location }, ownProps) => {
  const { loading, data, settings } = widgetFAOReforestation;
  const selectorData = {
    data: data.countries,
    location: location.payload,
    colors: COLORS.gain,
    settings,
    options: ownProps.settingsConfig.options
  };
  return {
    loading: loading || ownProps.isMetaLoading,
    data: getFilteredData(selectorData),
    sentence: getSentence(selectorData),
    colors: { ...COLORS.gain, ...COLORS.global }
  };
};

class WidgetFAOReforestationContainer extends PureComponent {
  componentWillMount() {
    const { location, settings, getFAOReforestationData } = this.props;
    getFAOReforestationData({
      ...location,
      ...settings
    });
  }

  componentWillReceiveProps(nextProps) {
    const { location, settings, getFAOReforestationData } = nextProps;

    if (
      !isEqual(location, this.props.location) ||
      !isEqual(settings.period, this.props.settings.period)
    ) {
      getFAOReforestationData({
        ...location,
        ...settings
      });
    }
  }

  render() {
    return createElement(WidgetFAOReforestationComponent, {
      ...this.props
    });
  }
}

WidgetFAOReforestationContainer.propTypes = {
  location: PropTypes.object.isRequired,
  settings: PropTypes.object.isRequired,
  getFAOReforestationData: PropTypes.func.isRequired
};

export { actions, reducers, initialState };

export default connect(mapStateToProps, actions)(
  WidgetFAOReforestationContainer
);
