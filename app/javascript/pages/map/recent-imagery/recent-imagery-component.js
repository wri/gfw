import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';

import Button from 'components/button';

import './recent-imagery-styles.scss';

class RecentImagery extends PureComponent {
  render() {
    const { toogleRecentImagery } = this.props;

    return (
      <div className="c-recent-imagery">
        <Button onClick={() => toogleRecentImagery()}>Recent Imagery</Button>
      </div>
    );
  }
}

RecentImagery.propTypes = {
  toogleRecentImagery: PropTypes.func.isRequired
};

export default RecentImagery;
