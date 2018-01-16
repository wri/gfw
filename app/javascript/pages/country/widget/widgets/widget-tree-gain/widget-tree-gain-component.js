import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';

import WidgetDynamicSentence from 'pages/country/widget/components/widget-dynamic-sentence';
import WidgetNumberedList from 'pages/country/widget/components/widget-numbered-list';
import NoContent from 'components/no-content';
import COLORS from 'pages/country/data/colors.json';

import './widget-tree-gain-styles.scss';

class WidgetTreeCoverGain extends PureComponent {
  render() {
    const { locationNames, loading, data, settings, getSentence } = this.props;

    return (
      <div className="c-widget-tree-cover-gain">
        {!loading &&
          data &&
          data.ranking.length === 0 && (
            <NoContent
              message={`No data for ${locationNames.current &&
                locationNames.current.label}`}
              icon
            />
          )}
        {!loading &&
          data &&
          data.ranking.length > 0 && (
            <div className="gain-data">
              <WidgetDynamicSentence sentence={getSentence()} />
              <WidgetNumberedList
                className="ranking-list"
                data={data.ranking}
                settings={settings}
                colorRange={[COLORS.darkGreen, COLORS.nonForest]}
                handlePageChange={() => {}}
              />
            </div>
          )}
      </div>
    );
  }
}

WidgetTreeCoverGain.propTypes = {
  loading: PropTypes.bool.isRequired,
  locationNames: PropTypes.object,
  data: PropTypes.object.isRequired,
  settings: PropTypes.object.isRequired,
  getSentence: PropTypes.func.isRequired
};

export default WidgetTreeCoverGain;
