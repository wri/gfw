import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';
import cx from 'classnames';

import Button from 'components/ui/button';
import Icon from 'components/ui/icon';

import satelliteDetailed from 'assets/icons/satellite-detailed.svg';

import './styles.scss';

class PendingDashboardMessage extends PureComponent {
  static propTypes = {
    className: PropTypes.string
  };

  state = {
    visible: true
  };

  render() {
    const { className } = this.props;

    return this.state.visible ? (
      <div className={cx('c-pending-dashboard', className)}>
        <div className="message">
          <div>
            <h3 className="title">Your custom dashboard is almost ready!</h3>
            <p>
              We are fetching and analyzing all available data for your recently
              created area of interest, and this takes our servers a few hours
              (all information is usually available the day after).
            </p>
            <p>
              <span>We will send you an email</span> once your dashboard is
              complete.
            </p>
          </div>
          <Icon icon={satelliteDetailed} className="satellite-detailed" />
        </div>
        <Button
          className="accept-btn"
          onClick={() => this.setState({ visible: false })}
        >
          Got it!
        </Button>
      </div>
    ) : null;
  }
}

export default PendingDashboardMessage;
