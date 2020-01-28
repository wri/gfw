import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';
import ReactHtmlParser from 'react-html-parser';

import treeImage from 'assets/icons/tree-success.png';

import './styles.scss';

class Thankyou extends PureComponent {
  static propTypes = {
    title: PropTypes.string,
    description: PropTypes.string
  };

  render() {
    const { title, description } = this.props;

    return (
      <div className="c-thankyou">
        <div className="message">
          <img src={treeImage} alt="thank-you-tree" />
          <h1>{title}</h1>
          <p>{ReactHtmlParser(description)}</p>
        </div>
      </div>
    );
  }
}

export default Thankyou;
