import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';

import Section from 'pages/topics/components/section';
import Biodiversity from 'pages/topics/content/biodiversity.json';

import Text from 'pages/topics/components/topics-text';
import Image from 'pages/topics/components/topics-image';
import Button from 'components/ui/button';

class Topic extends PureComponent {
  render() {
    const topics = {
      Biodiversity
    };
    const topic = topics[this.props.topic] || [];
    return (
      <div>
        {topic.map(s => (
          <Section key={s.subtitle}>
            <Text text={s.text} title={s.title} subtitle={s.subtitle} />
            <Image url={s.src} description={s.subtitle} />
            <Button theme="theme-button-grey topics-btn">Skip</Button>
          </Section>
        ))}
      </div>
    );
  }
}

Topic.propTypes = {
  topic: PropTypes.string
};

export default Topic;
