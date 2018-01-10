import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';

import WidgetDynamicSentence from 'pages/country/widget/components/widget-dynamic-sentence';
import './widget-fao-reforestation-styles.scss';

class WidgetFAOReforestation extends PureComponent {
  render() {
    const { getSentence } = this.props;

    return (
      <div className="c-widget-fao-reforestation">
        <WidgetDynamicSentence sentence={getSentence()} />
      </div>
    );
  }
}

WidgetFAOReforestation.propTypes = {
  getSentence: PropTypes.func.isRequired
};

export default WidgetFAOReforestation;
