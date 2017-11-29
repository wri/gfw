import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';
import numeral from 'numeral';

import Loader from 'components/loader/loader';
import WidgetHeader from 'pages/country/widgets/widget-header';
import WidgetTreeCoverGainSettings from './widget-tree-cover-gain-settings-component';
import './widget-tree-cover-gain-styles.scss';

class WidgetTreeCoverGain extends PureComponent {
  componentDidMount() {
    const { setInitialData } = this.props;
    setInitialData(this.props);
  }

  componentWillUpdate(nextProps) {
    const { settings, updateData } = this.props;

    if (JSON.stringify(settings) !== JSON.stringify(nextProps.settings)) {
      updateData(nextProps);
    }
  }

  render() {
    const {
      location,
      locationNames,
      isLoading,
      totalAmount,
      percentage,
      locations,
      settings,
      setTreeCoverGainSettingsLocation
    } = this.props;
    return (
      <div className="c-widget c-widget-tree-cover-gain">
        <WidgetHeader
          title={`TREE COVER GAIN IN ${locationNames.country &&
            locationNames.country.label}`}
          noMap={false}
          shareAnchor={'tree-cover-gain'}
        >
          <WidgetTreeCoverGainSettings
            type="settings"
            locations={locations}
            settings={settings}
            onLocationChange={setTreeCoverGainSettingsLocation}
          />
        </WidgetHeader>
        {isLoading ? (
          <Loader isAbsolute />
        ) : (
          <div className="c-widget-tree-cover-gain__container">
            <div className="c-widget-tree-cover-gain__info">
              <p className="title">Hansen - UMD</p>
              <p>
                Over the period of {settings.startYear}-{settings.endYear}{' '}
                {locationNames.country && locationNames.country.label} gained
                <strong>
                  {' '}
                  {numeral(Math.round(totalAmount / 1000)).format('0,0')}{' '}
                </strong>
                ha of tree cover{' '}
                {location.admin1 ? 'jurisdiction-wide' : 'country-wide'},
                equivalent to{' '}
                <strong>
                  {numeral(Math.round(percentage)).format('0,0')}%
                </strong>{' '}
                of countries total value.
              </p>
            </div>
          </div>
        )}
      </div>
    );
  }
}

WidgetTreeCoverGain.propTypes = {
  location: PropTypes.object.isRequired,
  locationNames: PropTypes.object.isRequired,
  isLoading: PropTypes.bool.isRequired,
  totalAmount: PropTypes.number.isRequired,
  percentage: PropTypes.number.isRequired,
  locations: PropTypes.array.isRequired,
  settings: PropTypes.object.isRequired,
  setInitialData: PropTypes.func.isRequired,
  updateData: PropTypes.func.isRequired,
  setTreeCoverGainSettingsLocation: PropTypes.func.isRequired
};

export default WidgetTreeCoverGain;
