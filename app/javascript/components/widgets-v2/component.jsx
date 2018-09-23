import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';

import Loader from 'components/ui/loader';
import NoContent from 'components/ui/no-content';

import Widget from './components/widget';

import './styles.scss';

class Widgets extends PureComponent {
  render() {
    const { noWidgetsMessage, loading, widgets, ...rest } = this.props;

    return (
      <div className="c-widgets">
        {loading && <Loader className="widgets-loader large" />}
        {!loading &&
          widgets &&
          widgets.map(w => <Widget key={w.widget} {...w} {...rest} />)}
        {!loading &&
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
  loading: PropTypes.bool,
  noWidgetsMessage: PropTypes.string,
  widgets: PropTypes.array
};

export default Widgets;
