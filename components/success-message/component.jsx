import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';
import ReactHtmlParser from 'react-html-parser';

import treeImage from 'assets/icons/tree-success.png';

import './styles.scss';

class Thankyou extends PureComponent {
  static propTypes = {
    title: PropTypes.string,
    description: PropTypes.string,
  };

  render() {
    const { title, description } = this.props;

    return (
      <div className="c-success-message">
        <img src={treeImage} alt="success-tree" />
        <h1>{title}</h1>
        {description && (
          <>
            {description.includes('<p>') ? (
              ReactHtmlParser(description)
            ) : (
              <p>{ReactHtmlParser(description)}</p>
            )}
          </>
        )}
      </div>
    );
  }
}

export default Thankyou;
