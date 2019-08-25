import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';

import Button from 'components/ui/button';
import Icon from 'components/ui/icon';

import shareIcon from 'assets/icons/share.svg';

import './styles.scss';

class WidgetShareButton extends PureComponent {
  static propTypes = {
    widget: PropTypes.string.isRequired,
    config: PropTypes.object.isRequired
  };

  renderShareButton() {
    const { shareData, setShareModal } = this.props;
    return (
      <Button
        className="theme-button-small square"
        onClick={() => setShareModal(shareData)}
        tooltip={{ text: 'Share or embed this widget' }}
      >
        <Icon icon={shareIcon} />
      </Button>
    );
  }
}

export default WidgetShareButton;
