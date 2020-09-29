import React from 'react';
import PropTypes from 'prop-types';

import './styles.scss';

const AreaSentence = ({ data }) =>
  data?.name ? (
    <div className="c-boundary-sentence">
      <p>{data?.name}</p>
    </div>
  ) : null;

AreaSentence.propTypes = {
  data: PropTypes.shape({
    name: PropTypes.string,
  }),
};

export default AreaSentence;
