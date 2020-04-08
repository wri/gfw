import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';
import ReactHtmlParser from 'react-html-parser';

import Icon from 'components/ui/icon';

import treeImage from 'assets/icons/tree-success.png';
import treeImageError from 'assets/icons/error.svg';

import './styles.scss';

class Thankyou extends PureComponent {
  static propTypes = {
    title: PropTypes.string,
    description: PropTypes.string,
    error: PropTypes.bool
  };

  render() {
    const { title, description, error } = this.props;

    return (
      <div className="c-thankyou">
        <div className="message">
          {error && <Icon icon={treeImageError} className="error-tree" />}
          {!error && <img src={treeImage} alt="thank-you-tree" />}
          <h1>{title}</h1>
          {description && <p>{ReactHtmlParser(description)}</p>}
        </div>
      </div>
    );
  }
}

export default Thankyou;
