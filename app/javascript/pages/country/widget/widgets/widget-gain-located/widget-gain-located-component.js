import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';

import WidgetNumberedList from 'pages/country/widget/components/widget-numbered-list';
import WidgetDynamicSentence from 'pages/country/widget/components/widget-dynamic-sentence';

import './widget-gain-located-styles.scss';

class WidgetGainLocated extends PureComponent {
  render() {
    const { data, settings, handlePageChange, embed, sentence } = this.props;

    return (
      <div className="c-widget-gain-located">
        <WidgetDynamicSentence sentence={sentence} />
        {data &&
          data.length > 0 && (
            <WidgetNumberedList
              className="locations-list"
              data={data}
              settings={settings}
              handlePageChange={handlePageChange}
              linksExt={embed}
            />
          )}
      </div>
    );
  }
}

WidgetGainLocated.propTypes = {
  data: PropTypes.array,
  settings: PropTypes.object.isRequired,
  handlePageChange: PropTypes.func.isRequired,
  embed: PropTypes.bool,
  sentence: PropTypes.string
};

export default WidgetGainLocated;
