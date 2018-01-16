import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';

import WidgetDynamicSentence from 'pages/country/widget/components/widget-dynamic-sentence';
import WidgetNumberedList from 'pages/country/widget/components/widget-numbered-list';

import './widget-fao-reforestation-styles.scss';

class WidgetFAOReforestation extends PureComponent {
  render() {
    const { getSentence, data, settings, colors, embed } = this.props;

    return (
      <div className="c-widget-fao-reforestation">
        {/* <WidgetDynamicSentence sentence={getSentence()} /> */}
        {data &&
          data.length > 0 && (
            <WidgetNumberedList
              className="locations-list"
              data={data}
              settings={settings}
              colorRange={[colors.darkGreen, colors.nonForest]}
              linksDisabled={embed}
            />
          )}
      </div>
    );
  }
}

WidgetFAOReforestation.propTypes = {
  getSentence: PropTypes.func.isRequired,
  data: PropTypes.array,
  settings: PropTypes.object.isRequired,
  colors: PropTypes.object.isRequired,
  embed: PropTypes.bool
};

export default WidgetFAOReforestation;
