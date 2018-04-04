import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';
import upperFirst from 'lodash/upperFirst';
import camelCase from 'lodash/camelCase';
import isEmpty from 'lodash/isEmpty';

import Loader from 'components/loader/loader';
import NoContent from 'components/no-content';
import Button from 'components/button';
import WidgetHeader from 'pages/country/widget/components/widget-header';
import WidgetSettingsStatement from 'pages/country/widget/components/widget-settings-statement';

import WidgetTreeCover from 'pages/country/widget/widgets/widget-tree-cover';
import WidgetTreeCoverPlantations from 'pages/country/widget/widgets/widget-tree-cover-plantations';
import WidgetIntactTreeCover from 'pages/country/widget/widgets/widget-intact-tree-cover';
import WidgetPrimaryTreeCover from 'pages/country/widget/widgets/widget-primary-tree-cover';
import WidgetTreeLocated from 'pages/country/widget/widgets/widget-tree-located';
import WidgetGainLocated from 'pages/country/widget/widgets/widget-gain-located';
import WidgetLossLocated from 'pages/country/widget/widgets/widget-loss-located';
import WidgetLossRanked from 'pages/country/widget/widgets/widget-loss-ranked';
import WidgetTreeCoverRanked from 'pages/country/widget/widgets/widget-tree-cover-ranked';
import WidgetTreeLoss from 'pages/country/widget/widgets/widget-tree-loss';
import WidgetTreeLossPlantations from 'pages/country/widget/widgets/widget-tree-loss-plantations';
import WidgetTreeGain from 'pages/country/widget/widgets/widget-tree-gain';
import WidgetFaoCover from 'pages/country/widget/widgets/widget-fao-cover';
import WidgetFaoReforestation from 'pages/country/widget/widgets/widget-fao-reforestation';
import WidgetFaoDeforestation from 'pages/country/widget/widgets/widget-fao-deforestation';
import WidgetGladAlerts from 'pages/country/widget/widgets/widget-glad-alerts';
import WidgetGladBiodiversity from 'pages/country/widget/widgets/widget-glad-biodiversity';
import WidgetGladRanked from 'pages/country/widget/widgets/widget-glad-ranked';
import WidgetRankedPlantations from 'pages/country/widget/widgets/widget-ranked-plantations';
import WidgetEmissions from 'pages/country/widget/widgets/widget-emissions';
import WidgetEmissionsDeforestation from 'pages/country/widget/widgets/widget-emissions-deforestation';
import WidgetFires from 'pages/country/widget/widgets/widget-fires';
import WidgetForestryEmployment from 'pages/country/widget/widgets/widget-forestry-employment';
import WidgetEconomicImpact from 'pages/country/widget/widgets/widget-economic-impact';

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
  WidgetLossRanked,
  WidgetTreeCoverRanked,
  WidgetTreeLoss,
  WidgetTreeLossPlantations,
  WidgetFaoCover,
  WidgetFaoReforestation,
  WidgetFaoDeforestation,
  WidgetGladAlerts,
  WidgetGladBiodiversity,
  WidgetGladRanked,
  WidgetRankedPlantations,
  WidgetEmissions,
  WidgetEmissionsDeforestation,
  WidgetFires,
  WidgetForestryEmployment,
  WidgetEconomicImpact
};

class Widget extends PureComponent {
  render() {
    const {
      widget,
      locationNames,
      location,
      title,
      settingsConfig,
      setWidgetSettingsUrl,
      embed,
      whitelist,
      loading,
      error,
      data,
      active,
      query,
      colors
    } = this.props;
    const WidgetComponent = widgets[`Widget${upperFirst(camelCase(widget))}`];
    const highlightColor =
      colors.main || (colors.extent && colors.extent.main) || '#a0c746';
    const haveMapLayers =
      settingsConfig.settings &&
      settingsConfig.settings.layers &&
      settingsConfig.settings.layers.length;
    const onMap = active && haveMapLayers;
    return (
      <div
        className={`c-widget ${settingsConfig.config.size || ''}`}
        style={{
          ...(!!onMap && {
            borderColor: highlightColor,
            boxShadow: `0 0px 0px 1px ${highlightColor}`
          }),
          ...(!!embed && {
            border: 0,
            borderRadius: 0
          })
        }}
        id={widget}
      >
        <WidgetHeader
          widget={widget}
          title={title}
          location={location}
          query={query}
          locationNames={locationNames}
          whitelist={whitelist}
          settingsConfig={{
            ...settingsConfig,
            onSettingsChange: setWidgetSettingsUrl
          }}
          embed={embed}
          active={active}
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
        {embed &&
          (!query || (query && !query.hideGfw)) && (
            <div className="embed-footer">
              <p>For more info</p>
              <Button
                className="embed-btn"
                extLink={`http://globalforestwatch.org/country/${
                  location.country
                }${location.region ? `/${location.region}` : ''}${
                  location.subRegion ? `/${location.subRegion}` : ''
                }?widget=${widget}${
                  query && query[widget] ? `&${widget}=${query[widget]}` : ''
                }#${widget}`}
              >
                EXPLORE ON GFW
              </Button>
            </div>
          )}
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
  location: PropTypes.object,
  query: PropTypes.object,
  embed: PropTypes.bool,
  loading: PropTypes.bool,
  error: PropTypes.bool,
  data: PropTypes.object,
  active: PropTypes.bool,
  colors: PropTypes.object,
  whitelist: PropTypes.object
};

export default Widget;
