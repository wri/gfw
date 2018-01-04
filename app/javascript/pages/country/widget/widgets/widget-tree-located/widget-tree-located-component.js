import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';

import Loader from 'components/loader/loader';
import WidgetHeader from 'pages/country/widget/components/widget-header';
import WidgetNumberedList from 'pages/country/widget/components/widget-numbered-list';
import NoContent from 'components/no-content';
import COLORS from 'pages/country/data/colors.json';

import './widget-tree-located-styles.scss';

class WidgetTreeLocated extends PureComponent {
  render() {
    const {
      locationNames,
      isLoading,
      data,
      options,
      settings,
      config,
      handlePageChange,
      setTreeLocatedSettingsIndicator,
      setTreeLocatedSettingsUnit,
      setTreeLocatedSettingsThreshold,
      title,
      anchorLink
    } = this.props;
    return (
      <div className="c-widget c-widget-tree-located">
        <WidgetHeader
          title={title}
          anchorLink={anchorLink}
          locationNames={locationNames}
          settingsConfig={{
            isLoading,
            config,
            settings,
            options,
            actions: {
              onIndicatorChange: setTreeLocatedSettingsIndicator,
              onUnitChange: setTreeLocatedSettingsUnit,
              onThresholdChange: setTreeLocatedSettingsThreshold
            }
          }}
        />
        <div className="container">
          {isLoading && <Loader />}
          {!isLoading &&
            data &&
            data.length === 0 && (
              <NoContent
                message={`No regions for ${locationNames.current &&
                  locationNames.current.label}`}
                icon
              />
            )}
          {!isLoading &&
            data &&
            data.length > 0 && (
              <WidgetNumberedList
                className="locations-list"
                data={data}
                settings={settings}
                handlePageChange={handlePageChange}
                colorRange={[COLORS.darkGreen, COLORS.nonForest]}
              />
            )}
        </div>
      </div>
    );
  }
}

WidgetTreeLocated.propTypes = {
  isLoading: PropTypes.bool.isRequired,
  locationNames: PropTypes.object,
  data: PropTypes.array.isRequired,
  options: PropTypes.object.isRequired,
  config: PropTypes.object.isRequired,
  settings: PropTypes.object.isRequired,
  handlePageChange: PropTypes.func.isRequired,
  setTreeLocatedSettingsIndicator: PropTypes.func.isRequired,
  setTreeLocatedSettingsUnit: PropTypes.func.isRequired,
  setTreeLocatedSettingsThreshold: PropTypes.func.isRequired,
  title: PropTypes.string.isRequired,
  anchorLink: PropTypes.string.isRequired
};

export default WidgetTreeLocated;
