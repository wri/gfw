import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';

import Text from 'pages/topics/components/topics-text';
import Image from 'pages/topics/components/topics-image';

// import './section-biodiversity-styles.scss';

class Section extends PureComponent {
  render() {
    const { text, imgURL } = this.props;
    return (
      <div className="section">
        <Text text={text} title="asdasda" />
        <Image url={imgURL} />
      </div>
    );
  }
}

Section.propTypes = {
  text: PropTypes.string.isRequired,
  imgURL: PropTypes.string.isRequired
};

export default Section;
