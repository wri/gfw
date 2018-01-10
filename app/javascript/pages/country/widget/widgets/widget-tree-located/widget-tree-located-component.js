import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';

import WidgetNumberedList from 'pages/country/widget/components/widget-numbered-list';
import NoContent from 'components/no-content';
import COLORS from 'pages/country/data/colors.json';

import './widget-tree-located-styles.scss';

class WidgetTreeLocated extends PureComponent {
  render() {
    const {
      locationNames,
      loading,
      data,
      settings,
      handlePageChange,
      embed
    } = this.props;
    return (
      <div className="c-widget-tree-located">
        {!loading &&
          data &&
          data.length === 0 && (
            <NoContent
              message={`No regions for ${locationNames.current &&
                locationNames.current.label}`}
              icon
            />
          )}
        {!loading &&
          data &&
          data.length > 0 && (
            <WidgetNumberedList
              className="locations-list"
              data={data}
              settings={settings}
              handlePageChange={handlePageChange}
              colorRange={[COLORS.darkGreen, COLORS.nonForest]}
              linksDisabled={embed}
            />
          )}
      </div>
    );
  }
}

WidgetTreeLocated.propTypes = {
  loading: PropTypes.bool.isRequired,
  locationNames: PropTypes.object,
  data: PropTypes.array.isRequired,
  settings: PropTypes.object.isRequired,
  handlePageChange: PropTypes.func.isRequired,
  embed: PropTypes.bool
};

export default WidgetTreeLocated;
