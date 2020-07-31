import React, { Component } from 'react';
import PropTypes from 'prop-types';

import './styles.scss';

class AreaSentence extends Component {
  static propTypes = {
    data: PropTypes.oneOfType([PropTypes.array, PropTypes.object]),
    selected: PropTypes.object
  };

  render() {
    const { data, selected } = this.props;
    const { name } = selected.data || {};

    return data ? (
      <div className="c-boundary-sentence">
        <p>{name}</p>
      </div>
    ) : null;
  }
}

export default AreaSentence;
