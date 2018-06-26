import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';

import Loader from 'components/ui/loader';

import './recent-imagery-thumbnail-styles.scss';

class RecentImageryThumbnail extends PureComponent {
  render() {
    const {
      id,
      tile,
      selected,
      handleClick,
      handleMouseEnter,
      handleMouseLeave
    } = this.props;

    return (
      <div
        className={`c-recent-imagery-thumbnail ${
          selected ? 'c-recent-imagery-thumbnail--selected' : ''
        }`}
        style={{
          backgroundImage: `url('${tile.thumbnail}')`
        }}
        onClick={handleClick}
        onMouseEnter={handleMouseEnter}
        onMouseLeave={handleMouseLeave}
        role="button"
        tabIndex={id}
      >
        {!tile.thumbnail && <Loader />}
      </div>
    );
  }
}

RecentImageryThumbnail.propTypes = {
  id: PropTypes.number.isRequired,
  tile: PropTypes.object.isRequired,
  selected: PropTypes.bool.isRequired,
  handleClick: PropTypes.func.isRequired,
  handleMouseEnter: PropTypes.func,
  handleMouseLeave: PropTypes.func
};

export default RecentImageryThumbnail;
