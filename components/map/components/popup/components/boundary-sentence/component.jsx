import React from 'react';
import PropTypes from 'prop-types';

import DynamicSentence from 'components/ui/dynamic-sentence';
import Button from 'components/ui/button';

import './styles.scss';

const BoundarySentence = ({ sentence, onAnalyze }) => (
  <div className="c-boundary-sentence">
    <DynamicSentence className="sentence" sentence={sentence} />
    <Button onClick={onAnalyze}>analyze</Button>
  </div>
);

BoundarySentence.propTypes = {
  data: PropTypes.shape({
    level: PropTypes.number,
  }),
  sentence: PropTypes.shape({
    sentence: PropTypes.string,
    params: PropTypes.object,
  }),
  onAnalyze: PropTypes.func,
};

export default BoundarySentence;
