import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';

import WidgetHeader from '../widget-header/widget-header';

class WidgetTreeLoss extends PureComponent {
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
        <div className="c-widget c-widget-tree-loss">
          <WidgetHeader title={`Forest loss`} />
          <div className="c-widget-tree-loss__chart">

          </div>
        </div>
      )
    }
  }
}

WidgetTreeLoss.propTypes = {
  isLoading: PropTypes.bool.isRequired,
  setInitialData: PropTypes.func.isRequired
};

export default WidgetTreeLoss;
