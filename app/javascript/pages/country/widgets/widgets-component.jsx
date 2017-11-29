import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';
import upperFirst from 'lodash/upperFirst';
import camelCase from 'lodash/camelCase';

import WidgetTreeCover from 'pages/country/widgets/widget-tree-cover';
import WidgetTreeLocated from 'pages/country/widgets/widget-tree-located';
import WidgetTreeLoss from 'pages/country/widgets/widget-tree-loss';
import WidgetTreeCoverLossAreas from 'pages/country/widgets/widget-tree-cover-loss-areas';
import WidgetAreasMostCoverGain from 'pages/country/widgets/widget-areas-most-cover-gain';
import WidgetTotalAreaPlantations from 'pages/country/widgets/widget-total-area-plantations';
import WidgetTreeCoverGain from 'pages/country/widgets/widget-tree-cover-gain';
import WidgetPlantationArea from 'pages/country/widgets/widget-plantation-area';
import WidgetStories from 'pages/country/widgets/widget-stories';

const widgets = {
  WidgetTreeCover,
  WidgetTreeLocated,
  WidgetTreeLoss,
  WidgetTreeCoverLossAreas,
  WidgetAreasMostCoverGain,
  WidgetTotalAreaPlantations,
  WidgetTreeCoverGain,
  WidgetPlantationArea,
  WidgetStories
};

class Widget extends PureComponent {
  render() {
    const { widget } = this.props;
    const WidgetComponent = widgets[`Widget${upperFirst(camelCase(widget))}`];
    return <WidgetComponent {...this.props} />;
  }
}

Widget.propTypes = {
  widget: PropTypes.string.isRequired,
  locationNames: PropTypes.object
};

export default Widget;
