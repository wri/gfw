import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';

import NumberedList from 'components/numbered-list';

class WidgetNumberedList extends PureComponent {
  render() {
    const {
      parsedData,
      settings,
      setWidgetSettings,
      embed,
      widget
    } = this.props;
    return (
      <NumberedList
        className="locations-list"
        data={parsedData}
        settings={{
          ...settings,
          format: settings.unit === '%' ? '.2r' : '.3s'
        }}
        handlePageChange={change =>
          setWidgetSettings({
            value: { page: settings.page + change },
            widget
          })
        }
        linksExt={embed}
      />
    );
  }
}

WidgetNumberedList.propTypes = {
  parsedData: PropTypes.array,
  settings: PropTypes.object.isRequired,
  setWidgetSettings: PropTypes.func.isRequired,
  embed: PropTypes.bool,
  widget: PropTypes.string
};

export default WidgetNumberedList;
