import React from 'react';
import PropTypes from 'prop-types';

const AreaSentence = ({ data }) =>
  data?.name ? (
    <div className="c-area-sentence">
      <p>{data?.name}</p>
    </div>
  ) : null;

AreaSentence.propTypes = {
  data: PropTypes.shape({
    name: PropTypes.string,
  }),
};

export default AreaSentence;
