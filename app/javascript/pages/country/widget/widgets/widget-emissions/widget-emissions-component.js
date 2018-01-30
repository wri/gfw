import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';

import WidgetDynamicSentence from 'pages/country/widget/components/widget-dynamic-sentence';

import './widget-emissions-styles.scss';

class WidgetEmissions extends PureComponent {
  render() {
    const { chartData, sentence } = this.props;

    return (
      <div className="c-widget-emissions">
        <WidgetDynamicSentence sentence={sentence} />
        {chartData && <div />}
      </div>
    );
  }
}

WidgetEmissions.propTypes = {
  chartData: PropTypes.array,
  sentence: PropTypes.string
};

export default WidgetEmissions;
