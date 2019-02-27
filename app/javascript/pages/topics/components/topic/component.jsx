import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';

import Section from 'pages/topics/components/section';
import Biodiversity from 'pages/topics/content/biodiversity.json';
import Carousel from 'components/ui/carousel';

class Topic extends PureComponent {
  render() {
    const topics = {
      Biodiversity
    };
    const topic = topics[this.props.topic] || [];
    const settings = {
      slidesToShow: 1,
      vertical: true,
      swipeToSlide: true,
      swipe: true
    };
    return (
      <Carousel settings={settings}>
        {topic.map((s, i) => (
          <div key={s.subtitle}>
            <Section
              content={{
                text: s.text,
                title: s.title,
                subtitle: s.subtitle
              }}
              imgURL={s.src}
              index={i}
            />
          </div>
        ))}
      </Carousel>
    );
  }
}

Topic.propTypes = {
  topic: PropTypes.string
};

export default Topic;
