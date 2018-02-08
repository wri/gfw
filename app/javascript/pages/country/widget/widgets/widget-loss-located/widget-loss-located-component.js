import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';

import WidgetNumberedList from 'pages/country/widget/components/widget-numbered-list';
import WidgetDynamicSentence from 'pages/country/widget/components/widget-dynamic-sentence';

import './widget-loss-located-styles.scss';

class WidgetLossLocated extends PureComponent {
  render() {
    const { data, settings, handlePageChange, embed, sentence } = this.props;

    return (
      <div className="c-widget-loss-located">
        <WidgetDynamicSentence sentence={sentence} />
        {data &&
          data.length > 0 && (
            <WidgetNumberedList
              className="locations-list"
              data={data}
              settings={settings}
              handlePageChange={handlePageChange}
              linksDisabled={embed}
            />
          )}
      </div>
    );
  }
}

WidgetLossLocated.propTypes = {
  data: PropTypes.array,
  settings: PropTypes.object.isRequired,
  handlePageChange: PropTypes.func.isRequired,
  embed: PropTypes.bool,
  sentence: PropTypes.string
};

export default WidgetLossLocated;
