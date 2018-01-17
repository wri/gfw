import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';

import WidgetDynamicSentence from 'pages/country/widget/components/widget-dynamic-sentence';
import WidgetNumberedList from 'pages/country/widget/components/widget-numbered-list';
import COLORS from 'pages/country/data/colors.json';

import './widget-tree-gain-styles.scss';

class WidgetTreeCoverGain extends PureComponent {
  render() {
    const { data, settings, getSentence } = this.props;

    return (
      <div className="c-widget-tree-cover-gain">
        {data &&
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
  data: PropTypes.object.isRequired,
  settings: PropTypes.object.isRequired,
  getSentence: PropTypes.func.isRequired
};

export default WidgetTreeCoverGain;
