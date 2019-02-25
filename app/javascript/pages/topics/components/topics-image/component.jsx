import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';

// import './styles.scss';

class TopicsImage extends PureComponent {
  render() {
    const { url, description } = this.props;
    return (
      <div className="c-topics-image">
        <img src={url} alt={description} />
      </div>
    );
  }
}

TopicsImage.propTypes = {
  url: PropTypes.string.isRequired,
  description: PropTypes.string
};

export default TopicsImage;
