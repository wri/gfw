import { createElement, PureComponent } from 'react';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';
import { format } from 'd3-format';
import isEqual from 'lodash/isEqual';
import sumBy from 'lodash/sumBy';
import { getLocationLabel } from 'pages/country/widget/widget-selectors';

import actions from './widget-tree-loss-actions';
import reducers, { initialState } from './widget-tree-loss-reducers';
import { filterData } from './widget-tree-loss-selectors';
import WidgetTreeLossComponent from './widget-tree-loss-component';

const mapStateToProps = ({ widgetTreeLoss }) => ({
  data:
    filterData({
      data: widgetTreeLoss.data,
      ...widgetTreeLoss.settings
    }) || [],
  extent: widgetTreeLoss.data.extent
});

class WidgetTreeLossContainer extends PureComponent {
  componentWillMount() {
    const { getTreeLoss, location, settings } = this.props;
    getTreeLoss({ ...location, ...settings });
  }

  componentWillUpdate(nextProps) {
    const { getTreeLoss, location, settings } = nextProps;

    if (
      !isEqual(location, this.props.location) ||
      !isEqual(settings.indicator, this.props.settings.indicator) ||
      !isEqual(settings.extentYear, this.props.settings.extentYear) ||
      !isEqual(settings.threshold, this.props.settings.threshold)
    ) {
      getTreeLoss({ ...location, ...settings });
    }
  }

  getSentence = () => {
    const { locationNames, settings, data, extent } = this.props;
    const { indicators } = this.props.options;
    const locationLabel = getLocationLabel(
      locationNames.current.label,
      settings.indicator,
      indicators
    );
    const totalLoss = (data && data.length && sumBy(data, 'area')) || 0;
    const totalEmissions =
      (data && data.length && sumBy(data, 'emissions')) || 0;
    const percentageLoss =
      (totalLoss && extent && totalLoss / extent * 100) || 0;
    return `Between <span>${settings.startYear}</span> and <span>${
      settings.endYear
    }</span>, 
      <span>${locationLabel}</span> lost <b>${format('.3s')(
      totalLoss
    )}ha</b> of tree cover${totalLoss ? '.' : ','} ${
      totalLoss > 0
        ? ` 
      This loss is equal to <b>${format('.1f')(
          percentageLoss
        )}%</b> of the regions tree cover extent in 2010, 
      and equivalent to <b>${format('.3s')(
          totalEmissions
        )}tonnes</b> of CO\u2082 emissions`
        : ''
    }
     with canopy density <span>> ${settings.threshold}%</span>.`;
  };

  render() {
    return createElement(WidgetTreeLossComponent, {
      ...this.props,
      getSentence: this.getSentence
    });
  }
}

WidgetTreeLossContainer.propTypes = {
  locationNames: PropTypes.object.isRequired,
  options: PropTypes.object.isRequired,
  settings: PropTypes.object.isRequired,
  location: PropTypes.object.isRequired,
  getTreeLoss: PropTypes.func.isRequired,
  data: PropTypes.array.isRequired,
  extent: PropTypes.number.isRequired
};

export { actions, reducers, initialState };

export default connect(mapStateToProps, actions)(WidgetTreeLossContainer);
