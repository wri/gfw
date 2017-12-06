import { createElement, PureComponent } from 'react';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';
import numeral from 'numeral';

import WidgetTreeCoverGainComponent from './widget-tree-cover-gain-component';
import actions from './widget-tree-cover-gain-actions';

export { initialState } from './widget-tree-cover-gain-reducers';
export { default as reducers } from './widget-tree-cover-gain-reducers';
export { default as actions } from './widget-tree-cover-gain-actions';

const mapStateToProps = state => ({
  location: state.location.payload,
  isLoading: state.widgetTreeCoverGain.isLoading,
  gain: state.widgetTreeCoverGain.gain,
  treeExtent: state.widgetTreeCoverGain.treeExtent,
  indicators: state.widgetTreeCoverGain.indicators,
  settings: state.widgetTreeCoverGain.settings
});

class WidgetTreeCoverGainContainer extends PureComponent {
  componentWillUpdate(nextProps) {
    const { isMetaLoading, settings } = this.props;

    if (JSON.stringify(settings) !== JSON.stringify(nextProps.settings)) {
      this.updateData(nextProps);
    }

    if (!nextProps.isMetaLoading && isMetaLoading) {
      this.setWidgetData(nextProps);
    }
  }

  setWidgetData = newProps => {
    const { location, settings, getTreeCoverGain } = newProps;

    getTreeCoverGain(
      location.country,
      location.region,
      location.subRegion,
      settings.indicator
    );
  };

  getSentence = () => {
    const {
      locationNames,
      gain,
      treeExtent,
      indicators,
      settings
    } = this.props;

    const indicator = indicators.filter(
      item => item.value === settings.indicator
    );
    const regionPhrase =
      settings.indicator === 'gadm28_only'
        ? 'region-wide'
        : `in ${indicator[0].label.toLowerCase()}`;

    const areaPercent = numeral(100 * treeExtent / gain).format('0,00');

    return {
      __html: `From 2001 to 2012, ${
        locationNames.current.label
      } gained <strong>${numeral(gain).format(
        '0,0'
      )} ha</strong> of tree cover in ${
        regionPhrase
      }, equivalent to a <strong>${
        areaPercent
      }%</strong> increase relative to 2010 tree cover extent.`
    };
  };

  updateData = newProps => {
    newProps.setTreeCoverGainIsLoading(true);
    this.setWidgetData(newProps);
  };

  render() {
    return createElement(WidgetTreeCoverGainComponent, {
      ...this.props,
      componentWillUpdate: this.componentWillUpdate,
      setWidgetData: this.setWidgetData,
      updateData: this.updateData,
      getSentence: this.getSentence
    });
  }
}

WidgetTreeCoverGainContainer.propTypes = {
  isMetaLoading: PropTypes.bool,
  locationNames: PropTypes.object,
  gain: PropTypes.number,
  treeExtent: PropTypes.number,
  indicators: PropTypes.array,
  settings: PropTypes.object
};

export default connect(mapStateToProps, actions)(WidgetTreeCoverGainContainer);
