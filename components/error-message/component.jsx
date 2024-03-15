import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';
import ReactHtmlParser from 'react-html-parser';

import Icon from 'components/ui/icon';

import treeImageError from 'assets/icons/error.svg?sprite';

class ErrorMessage extends PureComponent {
  static propTypes = {
    title: PropTypes.string,
    description: PropTypes.string,
    errors: PropTypes.array || PropTypes.object,
  };

  render() {
    const { title, description, errors } = this.props;

    const errorCode = btoa(
      JSON.stringify({
        datetime: new Date(),
        info: errors,
      })
    );

    return (
      <div className="c-error-message">
        <Icon icon={treeImageError} className="error-tree" />
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
        {errors && (
          <div className="c-error-message__error-code">
            Error code:<div>{errorCode}</div>
          </div>
        )}
      </div>
    );
  }
}

export default ErrorMessage;
