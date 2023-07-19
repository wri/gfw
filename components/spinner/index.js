import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';
import classnames from 'classnames';

const STYLES = {
  box: {
    width: 40,
    height: 40,
  },
  circle: {
    fill: 'none',
    stroke: '#000',
    strokeWidth: 5,
    strokeMiterlimit: 10,
  },
};

export class Spinner extends PureComponent {
  static propTypes = {
    position: PropTypes.oneOf(['relative', 'absolute', 'fixed']),
    className: PropTypes.string,
    customClass: PropTypes.string,
    style: PropTypes.shape({
      box: PropTypes.object,
      circle: PropTypes.object,
    }),
  };

  static defaultProps = {
    position: 'absolute',
    className: null,
    customClass: null,
    style: {
      box: {},
      circle: {},
    },
  };

  render() {
    const { position, customClass, style } = this.props;
    const classNames = classnames({
      'c-spinner': true,
      [`-${position}`]: true,
      [customClass]: !!customClass,
    });

    const boxStyles = { ...STYLES.box, ...style.box };
    const circleStyles = { ...STYLES.circle, ...style.circle };

    return (
      <div className={classNames}>
        <div className="spinner-box" style={boxStyles}>
          <svg className="spinner-icon" viewBox="25 25 50 50">
            <circle
              {...circleStyles}
              className="spinner-circle"
              cx={50}
              cy={50}
              r={20}
            />
          </svg>
        </div>
      </div>
    );
  }
}

export default Spinner;
