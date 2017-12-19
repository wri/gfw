import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';

import Loader from 'components/loader/loader';
import WidgetHeader from 'pages/country/widget/components/widget-header';
import WidgetDynamicSentence from 'pages/country/widget/components/widget-dynamic-sentence';
import WidgetSettings from 'pages/country/widget/components/widget-settings';
import './widget-fao-extent-styles.scss';

class WidgetFAOExtent extends PureComponent {
  render() {
    const {
      locationNames,
      isLoading,
      periods,
      settings,
      getSentence,
      setFAOExtentSettingsPeriod
    } = this.props;

    return (
      <div className="c-widget c-widget-fao-extent">
        <WidgetHeader title={'FAO REFORESTATION'} widget={'faoExtent'}>
          <WidgetSettings
            type="settings"
            periods={periods}
            settings={settings}
            onPeriodChange={setFAOExtentSettingsPeriod}
            isLoading={isLoading}
            locationNames={locationNames}
          />
        </WidgetHeader>
        {isLoading ? (
          <Loader />
        ) : (
          <div className="container">
            <WidgetDynamicSentence sentence={getSentence()} />
          </div>
        )}
      </div>
    );
  }
}

WidgetFAOExtent.propTypes = {
  locationNames: PropTypes.object.isRequired,
  isLoading: PropTypes.bool.isRequired,
  periods: PropTypes.array.isRequired,
  settings: PropTypes.object.isRequired,
  getSentence: PropTypes.func.isRequired,
  setFAOExtentSettingsPeriod: PropTypes.func.isRequired
};

export default WidgetFAOExtent;
