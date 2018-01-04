import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';

import Loader from 'components/loader/loader';
import WidgetHeader from 'pages/country/widget/components/widget-header';
import WidgetDynamicSentence from 'pages/country/widget/components/widget-dynamic-sentence';
import './widget-fao-reforestation-styles.scss';

class WidgetFAOReforestation extends PureComponent {
  render() {
    const {
      locationNames,
      isLoading,
      options,
      config,
      settings,
      getSentence,
      setFAOReforestationSettingsPeriod,
      title,
      anchorLink,
      widget
    } = this.props;

    return (
      <div className="c-widget c-widget-fao-reforestation">
        <WidgetHeader
          widget={widget}
          title={title}
          anchorLink={anchorLink}
          locationNames={locationNames}
          settingsConfig={{
            isLoading,
            config,
            settings,
            options,
            actions: {
              onPeriodChange: setFAOReforestationSettingsPeriod
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

WidgetFAOReforestation.propTypes = {
  locationNames: PropTypes.object.isRequired,
  isLoading: PropTypes.bool.isRequired,
  options: PropTypes.object.isRequired,
  settings: PropTypes.object.isRequired,
  config: PropTypes.object.isRequired,
  getSentence: PropTypes.func.isRequired,
  setFAOReforestationSettingsPeriod: PropTypes.func.isRequired,
  title: PropTypes.string.isRequired,
  anchorLink: PropTypes.string.isRequired,
  widget: PropTypes.string.isRequired
};

export default WidgetFAOReforestation;
