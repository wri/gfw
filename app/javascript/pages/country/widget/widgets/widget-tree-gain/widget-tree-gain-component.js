import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';

import Loader from 'components/loader';
import WidgetHeader from 'pages/country/widget/components/widget-header';
import WidgetSettings from 'pages/country/widget/components/widget-settings';
import WdigetDynamicSentence from 'pages/country/widget/components/widget-dynamic-sentence';

class WidgetTreeCoverGain extends PureComponent {
  render() {
    const {
      locationNames,
      isLoading,
      indicators,
      settings,
      getSentence,
      setTreeCoverGainSettingsIndicator
    } = this.props;

    return (
      <div className="c-widget c-widget-tree-cover-gain">
        <WidgetHeader
          title={`TREE COVER GAIN IN ${locationNames.current &&
            locationNames.current.label}`}
          widget={'treeGain'}
        >
          <WidgetSettings
            type="settings"
            indicators={indicators}
            settings={settings}
            onIndicatorChange={setTreeCoverGainSettingsIndicator}
            isLoading={isLoading}
            locationNames={locationNames}
          />
        </WidgetHeader>
        {isLoading ? (
          <Loader />
        ) : (
          <div className="container">
            <WdigetDynamicSentence sentence={getSentence()} />
          </div>
        )}
      </div>
    );
  }
}

WidgetTreeCoverGain.propTypes = {
  locationNames: PropTypes.object.isRequired,
  isLoading: PropTypes.bool.isRequired,
  indicators: PropTypes.array.isRequired,
  settings: PropTypes.object.isRequired,
  getSentence: PropTypes.func.isRequired,
  setTreeCoverGainSettingsIndicator: PropTypes.func.isRequired
};

export default WidgetTreeCoverGain;
