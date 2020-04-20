import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';

import WorldMap from 'components/world-map';
import NumberedList from 'components/widget/components/widget-numbered-list';

import './styles.scss';

class WidgetMapList extends PureComponent {
  static propTypes = {
    data: PropTypes.object,
    config: PropTypes.object,
    settings: PropTypes.object,
    embed: PropTypes.bool,
    widget: PropTypes.string,
    handleChangeSettings: PropTypes.func
  };

  render() {
    const { data, settings, embed, handleChangeSettings, widget } = this.props;
    const { rankedData } = data;

    return (
      <div className="c-widget-map-list">
        {data && <WorldMap className="simple-map" {...data} />}
        {rankedData && (
          <NumberedList
            className="locations-list"
            data={rankedData}
            settings={settings}
            linkExt={embed}
            widget={widget}
            handleChangeSettings={handleChangeSettings}
          />
        )}
      </div>
    );
  }
}

export default WidgetMapList;
