import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';

import NumberedList from 'components/numbered-list';

class WidgetNumberedList extends PureComponent {
  setInitialPage() {
    const { data, settings, handleChangeSettings } = this.props;
    // if the page is already set, don't change it
    if (settings.page && settings.page !== 0) return;

    if (Array.isArray(data) && data.length) {
      // find the current index of the data
      const currentIndex = data.findIndex((d) => d.isCurrent);
      if (currentIndex !== -1) {
        const pageSize = settings.pageSize || 5;
        const targetPage = Math.floor(currentIndex / pageSize);
        handleChangeSettings({ page: targetPage });
      }
    }
  }

  componentDidMount() {
    this.setInitialPage();
  }

  render() {
    const {
      className,
      data,
      settings,
      settingsConfig,
      handleChangeSettings,
      embed,
    } = this.props;

    return (
      <NumberedList
        className={className}
        data={data}
        settings={{
          ...settings,
          format: settings.unit === '%' ? '.2r' : '.2s',
        }}
        settingsConfig={settingsConfig}
        handlePageChange={(change) =>
          handleChangeSettings({ page: settings.page + change })}
        linksExt={embed}
      />
    );
  }
}

WidgetNumberedList.propTypes = {
  className: PropTypes.string,
  data: PropTypes.array,
  settings: PropTypes.object.isRequired,
  settingsConfig: PropTypes.array,
  handleChangeSettings: PropTypes.func.isRequired,
  embed: PropTypes.bool,
};

export default WidgetNumberedList;
