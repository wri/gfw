import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';

import Loader from 'components/ui/loader';
import Widget from './components/widget';

import './styles.scss';

class Widgets extends PureComponent {
  render() {
    const { loading, widgets, ...rest } = this.props;

    return (
      <div className="c-widgets">
        {loading && <Loader />}
        {!loading &&
          widgets.map(w => <Widget key={w.widget} {...w} {...rest} />)}
      </div>
    );
  }
}

Widgets.propTypes = {
  loading: PropTypes.bool,
  widgets: PropTypes.array
};

export default Widgets;
