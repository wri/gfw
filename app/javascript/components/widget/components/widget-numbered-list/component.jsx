import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';

import NumberedList from 'components/numbered-list';

class WidgetNumberedList extends PureComponent {
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
      <NumberedList
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

WidgetNumberedList.propTypes = {
  className: PropTypes.string,
  data: PropTypes.array,
  settings: PropTypes.object.isRequired,
  settingsConfig: PropTypes.object,
  handleChangeSettings: PropTypes.func.isRequired,
  embed: PropTypes.bool
};

export default WidgetNumberedList;
