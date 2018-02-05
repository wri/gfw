import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';

import WidgetComposedChart from 'pages/country/widget/components/widget-composed-chart';
import WidgetDynamicSentence from 'pages/country/widget/components/widget-dynamic-sentence';

import './widget-glad-alerts-styles.scss';

class WidgetGladAlerts extends PureComponent {
  render() {
    const { data, config, sentence, handleMouseMove, active } = this.props;

    return (
      <div className="c-widget-glad-alerts">
        {sentence && <WidgetDynamicSentence sentence={sentence} />}
        {data && (
          <WidgetComposedChart
            className="loss-chart"
            data={data}
            config={config}
            handleMouseMove={handleMouseMove}
            backgroundColor={active ? '#fefedc' : ''}
          />
        )}
      </div>
    );
  }
}

WidgetGladAlerts.propTypes = {
  data: PropTypes.array,
  config: PropTypes.object,
  sentence: PropTypes.string,
  handleMouseMove: PropTypes.func,
  active: PropTypes.bool
};

export default WidgetGladAlerts;
