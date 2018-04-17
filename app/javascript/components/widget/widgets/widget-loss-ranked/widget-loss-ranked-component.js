import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';

import NumberedList from 'components/numbered-list';
import WidgetDynamicSentence from '../../components/widget-dynamic-sentence';

import './widget-loss-ranked-styles.scss';

class WidgetLossRanked extends PureComponent {
  render() {
    const { data, sentence, settings, embed } = this.props;

    return (
      <div className="c-widget-loss-ranked">
        {data && (
          <div className="loss-data">
            {sentence && <WidgetDynamicSentence sentence={sentence} />}
            <NumberedList
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

WidgetLossRanked.propTypes = {
  data: PropTypes.array,
  settings: PropTypes.object.isRequired,
  sentence: PropTypes.string,
  embed: PropTypes.bool
};

export default WidgetLossRanked;
