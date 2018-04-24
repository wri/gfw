import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';
import upperFirst from 'lodash/upperFirst';
import camelCase from 'lodash/camelCase';
import isEmpty from 'lodash/isEmpty';

import Loader from 'components/ui/loader/loader';
import NoContent from 'components/ui/no-content';
import Button from 'components/ui/button';

import WidgetHeader from './components/widget-header';
import WidgetSettingsStatement from './components/widget-settings-statement';

import * as Widgets from './widget-manifest';

import './widget-styles.scss';

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
    const WidgetComponent = Widgets[`Widget${upperFirst(camelCase(widget))}`];
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
