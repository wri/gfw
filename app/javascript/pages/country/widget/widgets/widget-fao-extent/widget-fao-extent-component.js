import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';

import Loader from 'components/loader/loader';
import WidgetHeader from 'pages/country/widget/components/widget-header';
import WidgetDynamicSentence from 'pages/country/widget/components/widget-dynamic-sentence';
import './widget-fao-extent-styles.scss';

class WidgetFAOExtent extends PureComponent {
  render() {
    const {
      locationNames,
      isLoading,
      options,
      config,
      settings,
      getSentence,
      setFAOExtentSettingsPeriod
    } = this.props;

    return (
      <div className="c-widget c-widget-fao-extent">
        <WidgetHeader
          title="FAO REFORESTATION"
          shareAnchor={'fao-reforestation'}
          locationNames={locationNames}
          settingsConfig={{
            isLoading,
            config,
            settings,
            options,
            actions: {
              onPeriodChange: setFAOExtentSettingsPeriod
            }
          }}
        />
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
  options: PropTypes.object.isRequired,
  settings: PropTypes.object.isRequired,
  config: PropTypes.object.isRequired,
  getSentence: PropTypes.func.isRequired,
  setFAOExtentSettingsPeriod: PropTypes.func.isRequired
};

export default WidgetFAOExtent;
