import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';

import WidgetDynamicSentence from 'pages/country/widget/components/widget-dynamic-sentence';
import WidgetNumberedList from 'pages/country/widget/components/widget-numbered-list';

import './widget-tree-cover-ranked-styles.scss';

class WidgetTreeCoverRanked extends PureComponent {
  render() {
    const { data, sentence, settings, embed } = this.props;

    return (
      <div className="c-widget-tree-cover-ranked">
        {data && (
          <div className="extent-data">
            {sentence && <WidgetDynamicSentence sentence={sentence} />}
            <WidgetNumberedList
              className="ranking-list"
              data={data}
              settings={settings}
              linksExt={embed}
            />
          </div>
        )}
      </div>
    );
  }
}

WidgetTreeCoverRanked.propTypes = {
  data: PropTypes.array,
  settings: PropTypes.object.isRequired,
  sentence: PropTypes.string,
  embed: PropTypes.bool
};

export default WidgetTreeCoverRanked;
