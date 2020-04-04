import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';
import cx from 'classnames';

import './styles.scss';

class TopicsText extends PureComponent {
  render() {
    const { title, subtitle, text, className } = this.props;
    return (
      <div className={cx('c-topics-text', className)}>
        <span>{title}</span>
        <h4>{subtitle}</h4>
        <p>{text}</p>
      </div>
    );
  }
}

TopicsText.propTypes = {
  title: PropTypes.string.isRequired,
  subtitle: PropTypes.string,
  className: PropTypes.string,
  text: PropTypes.string.isRequired,
};

export default TopicsText;
