import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';
import ReactHtmlParser from 'react-html-parser';
import cx from 'classnames';

import Icon from 'components/ui/icon';

import treeImage from 'assets/icons/tree-success.png?webp';
import treeImageError from 'assets/icons/error.svg?sprite';

import './styles.scss';

class Thankyou extends PureComponent {
  static propTypes = {
    title: PropTypes.string,
    description: PropTypes.string,
    error: PropTypes.bool,
    large: PropTypes.bool
  };

  render() {
    const { title, description, error, large } = this.props;

    return (
      <div className={cx('c-confirmation-message', { large })}>
        {error && <Icon icon={treeImageError} className="error-tree" />}
        {!error && <img src={treeImage} alt="thank-you-tree" />}
        <h1>{title}</h1>
        {description && <p>{ReactHtmlParser(description)}</p>}
      </div>
    );
  }
}

export default Thankyou;
