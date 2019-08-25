import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';
import isEmpty from 'lodash/isEmpty';
import cx from 'classnames';

import WidgetMapButton from './components/widget-map-button';
import WidgetSettingsButton from './components/widget-settings-button';
import WidgetInfoButton from './components/widget-info-button';
import WidgetShareButton from './components/widget-share-button';

import './styles.scss';

class WidgetHeader extends PureComponent {
  static propTypes = {
    title: PropTypes.string.isRequired,
    settings: PropTypes.object,
    options: PropTypes.object,
    config: PropTypes.object,
    embed: PropTypes.bool,
    simple: PropTypes.bool
  };

  render() {
    const { title, settings, options, embed, config, simple } = this.props;

    return (
      <div className={cx('c-widget-header', { simple })}>
        <div className="title">{title}</div>
        <div className="options">
          {!embed &&
            !simple &&
            config.datasets && <WidgetMapButton {...this.props} />}
          {!embed &&
            !simple &&
            settings &&
            !isEmpty(options) &&
            config.options && <WidgetSettingsButton {...this.props} />}
          <div className="small-options">
            <WidgetInfoButton {...this.props} />
            {!simple && <WidgetShareButton {...this.props} />}
          </div>
        </div>
      </div>
    );
  }
}

export default WidgetHeader;
