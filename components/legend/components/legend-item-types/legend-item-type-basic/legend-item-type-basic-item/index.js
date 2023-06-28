import React from 'react';
import PropTypes from 'prop-types';
import './styles.scss';

class LegendItem extends React.PureComponent {
  static propTypes = {
    size: PropTypes.number,
    color: PropTypes.string,
    name: PropTypes.string,
    icon: PropTypes.string, // triangle, circle, square, line
    hideIcon: PropTypes.bool
  };

  static defaultProps = {
    size: 12,
    color: 'transparent',
    name: '',
    icon: 'square',
    hideIcon: false
  };

  getIconHtml = (iconName) => {
    const { name, hideIcon, color, size, icon } = this.props;

    if (hideIcon) {
      return null;
    }

    if (iconName === 'triangle') {
      return (
        <div
          styleName={`icon-${icon}`}
          style={{
            boderRightWidth: (size / 2),
            boderLeftWidth: (size / 2),
            boderBottomWidth: size,
            borderBottomColor: color
          }}
        />
      );
    }

    if (iconName === 'line') {
      return (<div styleName={`icon-${icon}`} style={{ width: size, backgroundColor: color }} />);
    }

    if (iconName === 'square' || iconName === 'circle') {
      return (
        <div
          styleName={`icon-${icon}`}
          style={{ width: size, height: size, backgroundColor: color }}
        />
      );
    }

    return (
      <div styleName="custom-icon">
        <img src={icon} alt={name} />
      </div>
    );
  };

  render() {
    const { name, icon } = this.props;

    return (
      <div styleName="c-legend-item-basic">
        {this.getIconHtml(icon)}

        <span styleName="name">
          {name}
        </span>
      </div>
    );
  }
}

export default LegendItem;
