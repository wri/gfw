import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';

import RecentImagerySettings from '../recent-imagery-settings';

class RecentImagerySettingsTooltip extends PureComponent {
  render() {
    const { getTooltipContentProps, ...rest } = this.props;

    return (
      <div
        className="c-recent-imagery-settings-tooltip"
        {...getTooltipContentProps()}
      >
        <RecentImagerySettings {...rest} />
      </div>
    );
  }
}

RecentImagerySettingsTooltip.propTypes = {
  getTooltipContentProps: PropTypes.func
};

export default RecentImagerySettingsTooltip;
