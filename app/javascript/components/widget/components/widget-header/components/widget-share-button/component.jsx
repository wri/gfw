import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';

import Button from 'components/ui/button';
import Icon from 'components/ui/icon';

import shareIcon from 'assets/icons/share.svg';

class WidgetShareButton extends PureComponent {
  static propTypes = {
    handleShowShare: PropTypes.func.isRequired
  };

  renderShareButton() {
    const { handleShowShare } = this.props;
    return (
      <Button
        className="theme-button-small square"
        onClick={handleShowShare}
        tooltip={{ text: 'Share or embed this widget' }}
      >
        <Icon icon={shareIcon} />
      </Button>
    );
  }
}

export default WidgetShareButton;
