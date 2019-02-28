import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';

// import './styles.scss';
// import biodiversity1 from 'assets/';
import bio1 from 'pages/topics/assets/biodiversity/bio1.png';
import bio2 from 'pages/topics/assets/biodiversity/bio2.png';
import bio3 from 'pages/topics/assets/biodiversity/bio3.png';
import bio4 from 'pages/topics/assets/biodiversity/bio4.png';

// @2x imgs
import bio1_2x from 'pages/topics/assets/biodiversity/bio1@2x.png';
import bio2_2x from 'pages/topics/assets/biodiversity/bio2@2x.png';
import bio3_2x from 'pages/topics/assets/biodiversity/bio3@2x.png';
import bio4_2x from 'pages/topics/assets/biodiversity/bio4@2x.png';

class TopicsImage extends PureComponent {
  render() {
    const imgs = {
      '1x': {
        biodiversity1: bio1,
        biodiversity2: bio2,
        biodiversity3: bio3,
        biodiversity4: bio4
      },
      '2x': {
        biodiversity1: bio1_2x,
        biodiversity2: bio2_2x,
        biodiversity3: bio3_2x,
        biodiversity4: bio4_2x
      }
    };
    const { url, description } = this.props;
    return (
      <div className="c-topics-image">
        <img
          srcSet={`${imgs['2x'][url]} 2x,
            ${imgs['1x'][url]} 1x,`}
          src={`${imgs['1x'][url]} 1x`}
          alt={description}
        />
      </div>
    );
  }
}

TopicsImage.propTypes = {
  url: PropTypes.string.isRequired,
  description: PropTypes.string
};

export default TopicsImage;
