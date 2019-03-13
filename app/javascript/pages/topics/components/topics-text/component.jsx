import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';
import cx from 'classnames';

import './styles.scss';

class TopicsText extends PureComponent {
  render() {
    const { title, subtitle, text, className } = this.props;
    return (
      <div className={cx('c-topics-text', className)}>
        <h3>{title}</h3>
        <h1>{subtitle}</h1>
        <p>{text}</p>
      </div>
    );
  }
}

TopicsText.propTypes = {
  title: PropTypes.string.isRequired,
  subtitle: PropTypes.string,
  className: PropTypes.string,
  text: PropTypes.string.isRequired
};

export default TopicsText;
