import React from 'react';
import PropTypes from 'prop-types';

import DynamicSentence from 'components/ui/dynamic-sentence';
import Button from 'components/ui/button';

import './styles.scss';

const ContextualSentence = ({
  data = {},
  setMapSettings,
  setAnalysisSettings,
  setMainMapSettings,
}) => {
  const { title, sentence, params } = data;

  return (
    <div className="c-contextual-sentence">
      <h5 className="place">{title}</h5>
      <DynamicSentence
        className="sentence"
        sentence={{
          sentence,
          params,
        }}
      />
      <Button
        onClick={() => {
          setMapSettings({ drawing: true });
          setAnalysisSettings({ showDraw: true });
          setMainMapSettings({ showAnalysis: true });
        }}
      >
        draw a shape to analyze
      </Button>
    </div>
  );
};

ContextualSentence.propTypes = {
  data: PropTypes.shape({
    title: PropTypes.string,
    sentence: PropTypes.string,
    params: PropTypes.object,
  }),
  setMapSettings: PropTypes.func,
  setAnalysisSettings: PropTypes.func,
  setMainMapSettings: PropTypes.func,
};

export default ContextualSentence;
