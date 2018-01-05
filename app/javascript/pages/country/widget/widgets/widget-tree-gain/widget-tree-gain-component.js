import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';

import Loader from 'components/loader';
import WidgetDynamicSentence from 'pages/country/widget/components/widget-dynamic-sentence';

import './widget-tree-gain-styles.scss';

class WidgetTreeCoverGain extends PureComponent {
  render() {
    const { loading, getSentence } = this.props;

    return (
      <div className="c-widget-tree-cover-gain">
        {loading ? (
          <Loader />
        ) : (
          <div className="gain-data">
            <WidgetDynamicSentence sentence={getSentence()} />
          </div>
        )}
      </div>
    );
  }
}

WidgetTreeCoverGain.propTypes = {
  loading: PropTypes.bool.isRequired,
  getSentence: PropTypes.func.isRequired
};

export default WidgetTreeCoverGain;
