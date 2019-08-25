import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';
import cx from 'classnames';

import Button from 'components/ui/button';
import Icon from 'components/ui/icon';

import infoIcon from 'assets/icons/info.svg';

import './styles.scss';

class WidgetInfoButton extends PureComponent {
  static propTypes = {
    widget: PropTypes.string.isRequired,
    config: PropTypes.object.isRequired
  };

  render() {
    const { metakey, setModalMetaSettings, simple } = this.props;
    return (
      <Button
        theme={cx('theme-button-small square', {
          'theme-button-grey-filled theme-button-xsmall': simple
        })}
        onClick={() => setModalMetaSettings(metakey)}
        tooltip={{ text: 'Learn more about the data' }}
      >
        <Icon icon={infoIcon} />
      </Button>
    );
  }
}

export default WidgetInfoButton;
