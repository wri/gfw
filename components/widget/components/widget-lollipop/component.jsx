import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';

import Lollipop from 'components/charts/lollipop-chart';

import './styles.scss';

class WidgetLollipop extends PureComponent {
  render() {
    const {
      data,
      settings,
      settingsConfig,
      config,
      handleChangeSettings,
      embed
    } = this.props;

    return (
      <Lollipop
        className="c-widget-lollipop-chart"
        data={data}
        config={config}
        settings={{
          ...settings,
          format: settings.unit === '%' ? '.2r' : '.3s'
        }}
        settingsConfig={settingsConfig}
        handlePageChange={change =>
          handleChangeSettings({ page: settings.page + change })
        }
        linksExt={embed}
      />
    );
  }
}

WidgetLollipop.propTypes = {
  data: PropTypes.array,
  settings: PropTypes.object.isRequired,
  settingsConfig: PropTypes.array,
  config: PropTypes.object,
  handleChangeSettings: PropTypes.func.isRequired,
  embed: PropTypes.bool
};

export default WidgetLollipop;
