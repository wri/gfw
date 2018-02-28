import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';

import WidgetDynamicSentence from 'pages/country/widget/components/widget-dynamic-sentence';
import WidgetNumberedList from 'pages/country/widget/components/widget-numbered-list';

import './widget-fao-deforestation-styles.scss';

class WidgetFAODeforestation extends PureComponent {
  render() {
    const { sentence, data, settings, embed } = this.props;

    return (
      <div className="c-widget-fao-deforestation">
        {sentence && <WidgetDynamicSentence sentence={sentence} />}
        {data &&
          data.length > 0 && (
            <WidgetNumberedList
              className="locations-list"
              data={data}
              settings={settings}
              linksExt={embed}
            />
          )}
      </div>
    );
  }
}

WidgetFAODeforestation.propTypes = {
  sentence: PropTypes.string,
  data: PropTypes.array,
  settings: PropTypes.object,
  embed: PropTypes.bool
};

export default WidgetFAODeforestation;
