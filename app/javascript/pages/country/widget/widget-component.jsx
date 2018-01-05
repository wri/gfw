import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';
import upperFirst from 'lodash/upperFirst';
import camelCase from 'lodash/camelCase';

import WidgetHeader from 'pages/country/widget/components/widget-header';

import WidgetTreeCover from 'pages/country/widget/widgets/widget-tree-cover';
import WidgetTreeLocated from 'pages/country/widget/widgets/widget-tree-located';
import WidgetTreeLoss from 'pages/country/widget/widgets/widget-tree-loss';
import WidgetTotalAreaPlantations from 'pages/country/widget/widgets/widget-total-area-plantations';
import WidgetTreeGain from 'pages/country/widget/widgets/widget-tree-gain';
import WidgetPlantationArea from 'pages/country/widget/widgets/widget-plantation-area';
import WidgetFaoCover from 'pages/country/widget/widgets/widget-fao-cover';
import WidgetFaoReforestation from 'pages/country/widget/widgets/widget-fao-reforestation';

import './widget-styles.scss';
import './widget-tooltip-styles.scss';

const widgets = {
  WidgetTreeCover,
  WidgetTreeGain,
  WidgetTreeLocated,
  WidgetTreeLoss,
  WidgetTotalAreaPlantations,
  WidgetPlantationArea,
  WidgetFaoCover,
  WidgetFaoReforestation
};

class Widget extends PureComponent {
  render() {
    const {
      widget,
      locationNames,
      title,
      settingsConfig,
      setWidgetSettingsUrl
    } = this.props;
    const WidgetComponent = widgets[`Widget${upperFirst(camelCase(widget))}`];
    return (
      <div className="c-widget">
        <WidgetHeader
          widget={widget}
          title={title}
          locationNames={locationNames}
          settingsConfig={{
            ...settingsConfig,
            onSettingsChange: setWidgetSettingsUrl
          }}
        />
        <div className="container">
          <WidgetComponent {...this.props} {...settingsConfig} />
        </div>
      </div>
    );
  }
}

Widget.propTypes = {
  widget: PropTypes.string.isRequired,
  title: PropTypes.string.isRequired,
  setWidgetSettingsUrl: PropTypes.func.isRequired,
  settingsConfig: PropTypes.object,
  locationNames: PropTypes.object
};

export default Widget;
