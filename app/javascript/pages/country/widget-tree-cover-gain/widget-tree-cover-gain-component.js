import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';
import numeral from 'numeral';

import Loader from 'components/loader/loader';
import WidgetHeader from 'pages/country/widget-header';
import WidgetTreeCoverGainSettings from './widget-tree-cover-gain-settings-component';

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
      isLoading,
      countryData,
      totalAmount,
      percentage,
      locations,
      settings,
      admin1,
      admin1List,
      setTreeCoverGainSettingsLocation
    } = this.props;
    return (
      <div className="c-widget c-widget-tree-cover-gain">
        <WidgetHeader
          title={`TREE COVER GAIN IN ${
            admin1 === 0
              ? countryData.name
              : admin1List[admin1 - 1].name
          }`}
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
                {admin1 === 0
                  ? countryData.name
                  : admin1List[admin1 - 1].name}{' '}
                gained
                <strong>
                  {' '}
                  {numeral(Math.round(totalAmount / 1000)).format('0,0')}{' '}
                </strong>
                ha of tree cover{' '}
                {admin1 === 0 ? 'country-wide' : 'jurisdiction-wide'},
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
  isLoading: PropTypes.bool.isRequired,
  admin1: PropTypes.number.isRequired,
  countryData: PropTypes.object.isRequired,
  admin1List: PropTypes.array.isRequired,
  totalAmount: PropTypes.number.isRequired,
  percentage: PropTypes.number.isRequired,
  locations: PropTypes.array.isRequired,
  settings: PropTypes.object.isRequired,
  setInitialData: PropTypes.func.isRequired,
  updateData: PropTypes.func.isRequired,
  setTreeCoverGainSettingsLocation: PropTypes.func.isRequired
};

export default WidgetTreeCoverGain;
