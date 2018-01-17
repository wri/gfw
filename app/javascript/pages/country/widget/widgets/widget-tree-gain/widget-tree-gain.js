import { createElement, PureComponent } from 'react';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';
import { format } from 'd3-format';
import isEqual from 'lodash/isEqual';

import { getActiveIndicator } from 'pages/country/widget/widget-selectors';

import actions from './widget-tree-gain-actions';
import reducers, { initialState } from './widget-tree-gain-reducers';
import WidgetTreeGainComponent from './widget-tree-gain-component';

const mapStateToProps = ({ widgetTreeGain }, ownProps) => ({
  loading: widgetTreeGain.loading || ownProps.isMetaLoading,
  gain: widgetTreeGain.data.gain,
  extent: widgetTreeGain.data.extent
});

class WidgetTreeGainContainer extends PureComponent {
  componentWillMount() {
    const { location, settings, getTreeGain } = this.props;
    getTreeGain({
      ...location,
      ...settings
    });
  }

  componentWillReceiveProps(nextProps) {
    const { settings, location, getTreeGain } = nextProps;

    if (
      !isEqual(location, this.props.location) ||
      !isEqual(settings, this.props.settings)
    ) {
      getTreeGain({
        ...location,
        ...settings
      });
    }
  }

  getSentence = () => {
    const { locationNames, gain, extent, settings } = this.props;
    const indicator = getActiveIndicator(settings.indicator);
    const regionPhrase =
      settings.indicator === 'gadm28'
        ? '<span>region-wide</span>'
        : `in <span>${indicator && indicator.label.toLowerCase()}</span>`;

    const areaPercent = format('.1f')(100 * gain / extent);
    const firstSentence = `From 2001 to 2012, <span>${locationNames.current &&
      locationNames.current.label}</span> gained <strong>${
      gain ? format('.3s')(gain) : '0'
    }ha</strong> of tree cover ${regionPhrase}`;
    const secondSentence = gain
      ? `, equivalent to a <strong>${areaPercent}%</strong> increase relative to 2010 tree cover extent.`
      : '.';

    return `${firstSentence}${secondSentence}`;
  };

  render() {
    return createElement(WidgetTreeGainComponent, {
      ...this.props,
      getSentence: this.getSentence
    });
  }
}

WidgetTreeGainContainer.propTypes = {
  locationNames: PropTypes.object.isRequired,
  gain: PropTypes.number.isRequired,
  extent: PropTypes.number.isRequired,
  settings: PropTypes.object.isRequired,
  location: PropTypes.object.isRequired,
  getTreeGain: PropTypes.func.isRequired
};

export { actions, reducers, initialState };

export default connect(mapStateToProps, actions)(WidgetTreeGainContainer);
