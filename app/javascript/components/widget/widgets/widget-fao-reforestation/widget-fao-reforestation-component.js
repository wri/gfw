import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';

import NumberedList from 'components/numbered-list';
import WidgetDynamicSentence from '../../components/widget-dynamic-sentence';

import './widget-fao-reforestation-styles.scss';

class WidgetFAOReforestation extends PureComponent {
  render() {
    const { sentence, data, settings, embed } = this.props;

    return (
      <div className="c-widget-fao-reforestation">
        {sentence && <WidgetDynamicSentence sentence={sentence} />}
        {data &&
          data.length > 0 && (
            <NumberedList
              className="locations-list"
              data={data}
              settings={settings}
              linkExt={embed}
            />
          )}
      </div>
    );
  }
}

WidgetFAOReforestation.propTypes = {
  sentence: PropTypes.string,
  data: PropTypes.array,
  settings: PropTypes.object,
  embed: PropTypes.bool
};

export default WidgetFAOReforestation;
