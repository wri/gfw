import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';

import Image from '../topics-image';
import Text from '../topics-text';

import './section-biodiversity-styles.scss';

class Section extends PureComponent {
  render() {
    const { text, imgURL } = this.props;
    return (
      <div className="section">
        <Text text={text} />
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
