import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';

import Widget from 'pages/country/widget';
import Share from 'components/share';
import CountryDataProvider from 'pages/country/providers/country-data-provider';

import WIDGETS_CONFIG from 'pages/country/data/widgets-config.json';

class Embed extends PureComponent {
  render() {
    const { widgetKey } = this.props;

    return (
      <div className="row">
        <div
          className={`large-${WIDGETS_CONFIG[widgetKey].gridWidth} small-12`}
        >
          <Widget
            widget={widgetKey}
            size={WIDGETS_CONFIG[widgetKey].gridWidth}
          />
        </div>
        <Share />
        <CountryDataProvider />
      </div>
    );
  }
}

Embed.propTypes = {
  widgetKey: PropTypes.string.isRequired
};

export default Embed;
