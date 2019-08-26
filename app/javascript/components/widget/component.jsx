import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';
import cx from 'classnames';

import WidgetHeader from './components/widget-header';
import WidgetBody from './components/widget-body';
import WidgetFooter from './components/widget-footer';

import './styles.scss';

class Widget extends PureComponent {
  static propTypes = {
    widget: PropTypes.string.isRequired,
    colors: PropTypes.object.isRequired,
    config: PropTypes.object.isRequired,
    simple: PropTypes.bool,
    embed: PropTypes.bool,
    active: PropTypes.bool,
    statements: PropTypes.array

  };

  render() {
    const { widget, colors, active, config: large, embed, simple } = this.props;
    const { main: mainColor } = colors || {};

    return (
      <div
        id={widget}
        className={cx('c-widget', { large }, { embed }, { simple })}
        style={{
          ...(active &&
            !simple &&
            !embed && {
            borderColor: mainColor,
            boxShadow: `0 0px 0px 1px ${mainColor}`
          })
        }}
      >
        <WidgetHeader {...this.props} />
        <WidgetBody {...this.props} />
        <WidgetFooter
          simple={simple}
          statements={statements}
          showAttributionLink={showAttributionLink}
        />
      </div>
    );
  }
}

export default Widget;
