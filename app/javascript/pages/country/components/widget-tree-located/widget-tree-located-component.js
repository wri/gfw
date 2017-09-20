import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';
import numeral from 'numeral';

import WidgetHeader from '../widget-header/widget-header';

class WidgetTreeLocated extends PureComponent {
  componentDidMount() {
    const { setInitialData } = this.props;
    setInitialData(this.props);
  }

  render() {
    const {
      isLoading,
      topRegions
    } = this.props;

    if (isLoading) {
      return <div>loading!</div>
    } else {
      return (
        <div className="c-widget c-widget-tree-located">
          <WidgetHeader title="WHERE ARE THE FORESTS LOCATED IN BRAZIL" />
          <ul className="c-widget-tree-located__regions">
            {topRegions.map((item, index) => {
              return (
                <li key={index}>
                  <div className="c-widget-tree-located__region-bubble">{index + 1}</div>
                  <div className="c-widget-tree-located__region-name">{item.name}</div>
                  <div className="c-widget-tree-located__region-percent">{item.percent}%</div>
                  <div className="c-widget-tree-located__region-value">{numeral(Math.round(item.value / 1000)).format('0,0')} Ha</div>
                </li>
              );
            })}
          </ul>
        </div>
      )
    }
  }
}

WidgetTreeLocated.propTypes = {
  isLoading: PropTypes.bool.isRequired,
  setInitialData: PropTypes.func.isRequired,
  topRegions: PropTypes.array.isRequired
};

export default WidgetTreeLocated;
