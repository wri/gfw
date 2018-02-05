import { createElement, PureComponent } from 'react';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';
import isEqual from 'lodash/isEqual';

import actions from './widget-fao-deforestation-actions';
import reducers, { initialState } from './widget-fao-deforestation-reducers';
import WidgetFAODeforestationComponent from './widget-fao-deforestation-component';
import {
  getFilteredData,
  getSentence
} from './widget-fao-deforestation-selectors';

const mapStateToProps = ({ widgetFAODeforestation, location }, ownProps) => {
  const { loading, data } = widgetFAODeforestation;
  const { colors, locationNames } = ownProps;
  const selectorData = {
    data,
    location: location.payload,
    locationNames,
    colors: colors.loss
  };
  return {
    loading: loading || ownProps.isMetaLoading,
    data: getFilteredData(selectorData),
    sentence: getSentence(selectorData),
    colors: ownProps.colors.gain
  };
};

class WidgetFAODeforestationContainer extends PureComponent {
  componentWillMount() {
    const { location, settings, getFAODeforestationData } = this.props;
    getFAODeforestationData({
      ...location,
      ...settings
    });
  }

  componentWillReceiveProps(nextProps) {
    const { location, settings, getFAODeforestationData } = nextProps;

    if (
      !isEqual(location, this.props.location) ||
      !isEqual(settings.period, this.props.settings.period)
    ) {
      getFAODeforestationData({
        ...location,
        ...settings
      });
    }
  }

  render() {
    return createElement(WidgetFAODeforestationComponent, {
      ...this.props
    });
  }
}

WidgetFAODeforestationContainer.propTypes = {
  location: PropTypes.object.isRequired,
  settings: PropTypes.object.isRequired,
  getFAODeforestationData: PropTypes.func.isRequired
};

export { actions, reducers, initialState };

export default connect(mapStateToProps, actions)(
  WidgetFAODeforestationContainer
);
