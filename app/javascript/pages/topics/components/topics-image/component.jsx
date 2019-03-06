import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';

// import './styles.scss';
// biodiversity @1x
import bio1 from 'pages/topics/assets/biodiversity/biodiversity1.png';
import bio2 from 'pages/topics/assets/biodiversity/biodiversity2.png';
import bio3 from 'pages/topics/assets/biodiversity/biodiversity3.png';
import bio4 from 'pages/topics/assets/biodiversity/biodiversity4.png';

// @2x imgs
import bio1_2x from 'pages/topics/assets/biodiversity/biodiversity1@2x.png';
import bio2_2x from 'pages/topics/assets/biodiversity/biodiversity2@2x.png';
import bio3_2x from 'pages/topics/assets/biodiversity/biodiversity3@2x.png';
import bio4_2x from 'pages/topics/assets/biodiversity/biodiversity4@2x.png';

// commodities @1x
import com1 from 'pages/topics/assets/commodities/commodities1.png';
import com2 from 'pages/topics/assets/commodities/commodities2.png';
import com3 from 'pages/topics/assets/commodities/commodities3.png';
import com4 from 'pages/topics/assets/commodities/commodities4.png';

// @2x imgs
import com1_2x from 'pages/topics/assets/commodities/commodities1@2x.png';
import com2_2x from 'pages/topics/assets/commodities/commodities2@2x.png';
import com3_2x from 'pages/topics/assets/commodities/commodities3@2x.png';
import com4_2x from 'pages/topics/assets/commodities/commodities4@2x.png';

class TopicsImage extends PureComponent {
  render() {
    const imgs = {
      '1x': {
        biodiversity1: bio1,
        biodiversity2: bio2,
        biodiversity3: bio3,
        biodiversity4: bio4,
        commodities1: com1,
        commodities2: com2,
        commodities3: com3,
        commodities4: com4
      },
      '2x': {
        biodiversity1: bio1_2x,
        biodiversity2: bio2_2x,
        biodiversity3: bio3_2x,
        biodiversity4: bio4_2x,
        commodities1: com1_2x,
        commodities2: com2_2x,
        commodities3: com3_2x,
        commodities4: com4_2x
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
