import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';

import Loader from 'components/loader';

import './recent-imagery-thumbnail-styles.scss';

class RecentImageryThumbnail extends PureComponent {
  render() {
    const { id, tile, selected, handleClick } = this.props;

    return (
      <div
        className={`c-recent-imagery-thumbnail ${
          selected ? 'c-recent-imagery-thumbnail--selected' : ''
        }`}
        style={{
          backgroundImage: `url('${tile.thumbnail}')`
        }}
        onClick={handleClick}
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
  handleClick: PropTypes.func.isRequired
};

export default RecentImageryThumbnail;
