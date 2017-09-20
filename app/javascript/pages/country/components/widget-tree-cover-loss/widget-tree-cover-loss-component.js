import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';

import WidgetHeader from '../widget-header/widget-header';

class WidgetTreeCover extends PureComponent {
  componentDidMount() {
    const { setInitialData } = this.props;
    setInitialData(this.props);
  }

  render() {
    const {
      isLoading
    } = this.props;

    if (isLoading) {
      return <div>loading!</div>
    } else {
      return (
        <div className="c-widget c-widget-tree-cover-loss">
          <WidgetHeader title={`Forest cover loss`} />
          <div className="c-widget-tree-cover-loss__chart">

          </div>
        </div>
      )
    }
  }
}

WidgetTreeCover.propTypes = {
  isLoading: PropTypes.bool.isRequired,
  setInitialData: PropTypes.func.isRequired
};

export default WidgetTreeCover;
