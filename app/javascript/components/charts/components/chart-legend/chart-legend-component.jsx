import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';
import cx from 'classnames';

import Button from 'components/ui/button';

import './chart-legend-styles.scss';

class ChartLegend extends PureComponent {
  render() {
    const { config, className, simple } = this.props;

    return (
      <ul className={cx('c-chart-legend', className, { simple })}>
        {Object.keys(config).map(k => {
          const item = config[k];

          return (
            <li className="legend-item" key={k}>
              <div className="legend-title">
                <span
                  style={{
                    backgroundColor: item.color
                  }}
                />
                <p>{item.label}</p>
              </div>
            </li>
          );
        })}
        <Button
          theme="theme-button-small theme-button-light"
          className="contextual-settings-btn"
          onClick={() => {}}
        >
          + Add year to compare
        </Button>
      </ul>
    );
  }
}

ChartLegend.propTypes = {
  config: PropTypes.object,
  simple: PropTypes.bool,
  className: PropTypes.string
};

export default ChartLegend;
