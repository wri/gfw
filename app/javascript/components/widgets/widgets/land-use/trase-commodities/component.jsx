import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';

import WorldMap from 'components/world-map';
import NumberedList from 'components/numbered-list';

import './styles';

class WidgetTraseCommodities extends PureComponent {
  render() {
    const { data, settings, embed } = this.props;
    const { rankedData } = data;

    return (
      <div className="c-widget-economic-impact">
        {data && (
          <WorldMap
            {...data}
          />
        )}
        {rankedData && (
          <NumberedList
            className="locations-list"
            data={rankedData}
            settings={settings}
            linkExt={embed}
          />
        )}
      </div>
    );
  }
}

WidgetTraseCommodities.propTypes = {
  data: PropTypes.object,
  config: PropTypes.object,
  settings: PropTypes.object,
  embed: PropTypes.bool
};
export default WidgetTraseCommodities;
