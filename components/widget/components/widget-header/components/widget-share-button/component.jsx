import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';

import Button from 'components/ui/button';
import Icon from 'components/ui/icon';

import shareIcon from 'assets/icons/share.svg?sprite';

class WidgetShareButton extends PureComponent {
  static propTypes = {
    handleShowShare: PropTypes.func.isRequired,
    widget: PropTypes.string,
  };

  render() {
    const { handleShowShare, widget } = this.props;
    return (
      <Button
        id={`widget-share-button-${widget}`}
        className="c-widget-share-btn theme-button-small square widget-control-button"
        onClick={handleShowShare}
        tooltip={{ text: 'Share or embed this widget' }}
      >
        <Icon icon={shareIcon} />
      </Button>
    );
  }
}

export default WidgetShareButton;
