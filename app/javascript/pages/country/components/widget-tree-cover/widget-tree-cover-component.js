import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';

class WidgetTreeCover extends PureComponent {
  componentDidMount() {
    const { setInitialData } = this.props;
    setInitialData(this.props);
  }

  render() {
    const {
      isLoading,
      totalCover,
      totalIntactForest,
      totalNonForest
    } = this.props;

    if (isLoading) {
      return <div>loading!</div>
    } else {
      return (
        <div className="c-widget c-widget-tree-cover">
          <div>FOREST COVER IN BRAZIL</div>
          <ul>
            <li>
              <div>Forest</div>
              <div>{totalCover}</div>
            </li>
            <li>
              <div>Intact Forest</div>
              <div>{totalIntactForest}</div>
            </li>
            <li>
              <div>Non Forest</div>
              <div>{totalNonForest}</div>
            </li>
          </ul>
          <div></div>
        </div>
      )
    }
  }
}

WidgetTreeCover.propTypes = {
  isLoading: PropTypes.bool.isRequired,
  setInitialData: PropTypes.func.isRequired,
  totalCover: PropTypes.number.isRequired,
  totalIntactForest: PropTypes.number.isRequired,
  totalNonForest: PropTypes.number.isRequired
};

export default WidgetTreeCover;
