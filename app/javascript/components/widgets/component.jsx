import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';
import cx from 'classnames';

import Loader from 'components/ui/loader';
import NoContent from 'components/ui/no-content';

import Widget from 'components/widget';

import './styles.scss';

class Widgets extends PureComponent {
  render() {
    const {
      className,
      noWidgetsMessage,
      loading,
      widgets,
      ...rest
    } = this.props;

    return (
      <div
        className={cx(
          'c-widgets',
          className,
          { simple: this.props.simple },
          {
            'no-widgets':
              !loading &&
              !noWidgetsMessage &&
              (!widgets || widgets.length === 0)
          }
        )}
      >
        {loading && <Loader className="widgets-loader large" />}
        {!loading &&
          widgets &&
          widgets.map(w => <Widget key={w.widget} {...w} {...rest} />)}
        {!loading &&
          noWidgetsMessage &&
          (!widgets || widgets.length === 0) && (
            <NoContent
              className="no-widgets-message large"
              message={noWidgetsMessage}
              icon
            />
          )}
      </div>
    );
  }
}

Widgets.propTypes = {
  className: PropTypes.string,
  loading: PropTypes.bool,
  noWidgetsMessage: PropTypes.string,
  widgets: PropTypes.array,
  simple: PropTypes.bool
};

export default Widgets;
