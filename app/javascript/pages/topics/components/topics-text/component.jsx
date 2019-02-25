import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';

import './styles.scss';

class TopicsText extends PureComponent {
  render() {
    const { title, subtitle, text } = this.props;
    return (
      <div className="c-topics-text">
        <h3>{subtitle}</h3>
        <h1>{title}</h1>
        <p>{text}</p>
      </div>
    );
  }
}

TopicsText.propTypes = {
  title: PropTypes.string.isRequired,
  subtitle: PropTypes.string,
  text: PropTypes.string.isRequired
};

export default TopicsText;
