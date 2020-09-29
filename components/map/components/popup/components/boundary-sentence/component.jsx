import React, { Component } from 'react';
import PropTypes from 'prop-types';

import DynamicSentence from 'components/ui/dynamic-sentence';

import './styles.scss';

class BoundarySentence extends Component {
  static propTypes = {
    data: PropTypes.shape({
      level: PropTypes.number,
    }),
    sentence: PropTypes.shape({
      sentence: PropTypes.string,
      params: PropTypes.object,
    }),
    onSelectBoundary: PropTypes.func,
    selected: PropTypes.object,
  };

  handleSetAnalysisView = () => {
    const { onSelectBoundary, selected, data } = this.props;
    onSelectBoundary({
      ...selected,
      data: { ...data, level: data.level - 1 },
    });
  };

  render() {
    const { sentence } = this.props;

    return (
      <DynamicSentence className="c-boundary-sentence" sentence={sentence} />
    );
  }
}

export default BoundarySentence;
