import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';

import Loader from 'components/loader/loader';
import WidgetDynamicSentence from 'pages/country/widget/components/widget-dynamic-sentence';
import './widget-fao-reforestation-styles.scss';

class WidgetFAOReforestation extends PureComponent {
  render() {
    const { loading, getSentence } = this.props;

    return (
      <div className="c-widget-fao-reforestation">
        {loading ? (
          <Loader />
        ) : (
          <WidgetDynamicSentence sentence={getSentence()} />
        )}
      </div>
    );
  }
}

WidgetFAOReforestation.propTypes = {
  loading: PropTypes.bool.isRequired,
  getSentence: PropTypes.func.isRequired
};

export default WidgetFAOReforestation;
