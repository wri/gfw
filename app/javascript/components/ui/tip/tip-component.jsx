import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';

import './tip-styles.scss';

class Tip extends PureComponent {
  render() {
    const { text } = this.props;
    return <div className="c-tip">{text}</div>;
  }
}

Tip.propTypes = {
  text: PropTypes.string
};

export default Tip;
