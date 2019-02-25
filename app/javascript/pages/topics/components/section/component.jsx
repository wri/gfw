import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';

import Text from 'pages/topics/components/topics-text';
import Image from 'pages/topics/components/topics-image';
import Button from 'components/ui/button';

// import './section-biodiversity-styles.scss';

class Section extends PureComponent {
  render() {
    const { content, imgURL } = this.props;
    const { text, title, subtitle } = content;
    return (
      <div className="c-section">
        <Text text={text} title={title} subtitle={subtitle} />
        <Image url={imgURL} description={subtitle} />
        <Button theme="theme-button-grey topics-btn">Skip</Button>
      </div>
    );
  }
}

Section.propTypes = {
  content: PropTypes.object.isRequired,
  imgURL: PropTypes.string.isRequired
};

export default Section;
