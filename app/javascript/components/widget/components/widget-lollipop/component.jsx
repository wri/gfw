import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';

import Lollipop from 'components/charts/lollipop-chart';

class WidgetLollipop extends PureComponent {
  render() {
    const {
      className,
      data,
      settings,
      settingsConfig,
      handleChangeSettings,
      embed
    } = this.props;

    return (
      <Lollipop
        className={className}
        data={data}
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
  className: PropTypes.string,
  data: PropTypes.array,
  settings: PropTypes.object.isRequired,
  settingsConfig: PropTypes.array,
  handleChangeSettings: PropTypes.func.isRequired,
  embed: PropTypes.bool
};

export default WidgetLollipop;
