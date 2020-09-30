import React, { Component } from 'react';
import PropTypes from 'prop-types';

import DynamicSentence from 'components/ui/dynamic-sentence';
import Button from 'components/ui/button';

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
    onAnalyze: PropTypes.func,
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
    const { data, sentence, onAnalyze } = this.props;

    return (
      <div className="c-boundary-sentence">
        <DynamicSentence className="sentence" sentence={sentence} />
        <Button
          onClick={() => {
            onAnalyze(data);
          }}
        >
          analyze
        </Button>
      </div>
    );
  }
}

export default BoundarySentence;
