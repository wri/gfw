import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';
import upperFirst from 'lodash/upperFirst';
import camelCase from 'lodash/camelCase';
import isEmpty from 'lodash/isEmpty';

import Loader from 'components/loader/loader';
import NoContent from 'components/no-content';
import WidgetHeader from 'pages/country/widget/components/widget-header';
import WidgetSettingsStatement from 'pages/country/widget/components/widget-settings-statement';

import WidgetTreeCover from 'pages/country/widget/widgets/widget-tree-cover';
import WidgetTreeCoverPlantations from 'pages/country/widget/widgets/widget-tree-cover-plantations';
import WidgetIntactTreeCover from 'pages/country/widget/widgets/widget-intact-tree-cover';
import WidgetPrimaryTreeCover from 'pages/country/widget/widgets/widget-primary-tree-cover';
import WidgetTreeLocated from 'pages/country/widget/widgets/widget-tree-located';
import WidgetGainLocated from 'pages/country/widget/widgets/widget-gain-located';
import WidgetLossLocated from 'pages/country/widget/widgets/widget-loss-located';
import WidgetTreeLoss from 'pages/country/widget/widgets/widget-tree-loss';
import WidgetTreeLossPlantations from 'pages/country/widget/widgets/widget-tree-loss-plantations';
import WidgetTreeGain from 'pages/country/widget/widgets/widget-tree-gain';
import WidgetFaoCover from 'pages/country/widget/widgets/widget-fao-cover';
import WidgetFaoReforestation from 'pages/country/widget/widgets/widget-fao-reforestation';
import WidgetGladAlerts from 'pages/country/widget/widgets/widget-glad-alerts';
import WidgetRankedPlantations from 'pages/country/widget/widgets/widget-ranked-plantations';

import './widget-styles.scss';
import './widget-tooltip-styles.scss';

const widgets = {
  WidgetTreeCover,
  WidgetTreeCoverPlantations,
  WidgetIntactTreeCover,
  WidgetPrimaryTreeCover,
  WidgetTreeGain,
  WidgetTreeLocated,
  WidgetGainLocated,
  WidgetLossLocated,
  WidgetTreeLoss,
  WidgetTreeLossPlantations,
  WidgetFaoCover,
  WidgetFaoReforestation,
  WidgetGladAlerts,
  WidgetRankedPlantations
};

class Widget extends PureComponent {
  render() {
    const {
      widget,
      locationNames,
      title,
      settingsConfig,
      setWidgetSettingsUrl,
      embed,
      loading,
      error,
      data
    } = this.props;
    const WidgetComponent = widgets[`Widget${upperFirst(camelCase(widget))}`];
    return (
      <div
        className={`c-widget ${settingsConfig.config.size || ''}`}
        id={widget}
      >
        <WidgetHeader
          widget={widget}
          title={title}
          locationNames={locationNames}
          settingsConfig={{
            ...settingsConfig,
            onSettingsChange: setWidgetSettingsUrl
          }}
          embed={embed}
        />
        <div className="container">
          {!loading &&
            !error &&
            isEmpty(data) && (
              <NoContent
                message={`No data in selection for ${locationNames.current &&
                  locationNames.current.label}`}
              />
            )}
          {loading && <Loader />}
          {!loading &&
            error && (
              <NoContent message="An error occured while fetching data. Please try again later." />
            )}
          {!error && <WidgetComponent {...this.props} {...settingsConfig} />}
        </div>
        <WidgetSettingsStatement settings={settingsConfig.settings} />
      </div>
    );
  }
}

Widget.propTypes = {
  widget: PropTypes.string.isRequired,
  title: PropTypes.string.isRequired,
  setWidgetSettingsUrl: PropTypes.func.isRequired,
  settingsConfig: PropTypes.object,
  locationNames: PropTypes.object,
  embed: PropTypes.bool,
  loading: PropTypes.bool,
  error: PropTypes.bool,
  data: PropTypes.object
};

export default Widget;
