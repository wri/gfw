import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';

import Loader from 'components/loader';
import WidgetHeader from 'pages/country/widget/components/widget-header';
import WidgetDynamicSentence from 'pages/country/widget/components/widget-dynamic-sentence';

import './widget-tree-gain-styles.scss';

class WidgetTreeCoverGain extends PureComponent {
  render() {
    const {
      locationNames,
      isLoading,
      options,
      config,
      settings,
      getSentence,
      setTreeCoverGainSettingsIndicator,
      setTreeCoverGainSettingsThreshold,
      title,
      anchorLink
    } = this.props;

    return (
      <div className="c-widget c-widget-tree-cover-gain">
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
              onIndicatorChange: setTreeCoverGainSettingsIndicator,
              onThresholdChange: setTreeCoverGainSettingsThreshold
            }
          }}
        />
        <div className="container">
          {isLoading ? (
            <Loader />
          ) : (
            <div className="gain-data">
              <WidgetDynamicSentence sentence={getSentence()} />
            </div>
          )}
        </div>
      </div>
    );
  }
}

WidgetTreeCoverGain.propTypes = {
  locationNames: PropTypes.object.isRequired,
  isLoading: PropTypes.bool.isRequired,
  options: PropTypes.object.isRequired,
  config: PropTypes.object.isRequired,
  settings: PropTypes.object.isRequired,
  getSentence: PropTypes.func.isRequired,
  setTreeCoverGainSettingsIndicator: PropTypes.func.isRequired,
  setTreeCoverGainSettingsThreshold: PropTypes.func.isRequired,
  title: PropTypes.string.isRequired,
  anchorLink: PropTypes.string.isRequired
};

export default WidgetTreeCoverGain;
