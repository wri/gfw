import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';

import Section from 'pages/topics/components/section';
import Biodiversity from 'pages/topics/content/biodiversity.json';

class Topic extends PureComponent {
  render() {
    const topics = {
      Biodiversity
    };
    const topic = topics[this.props.topic] || [];
    return (
      <div id="fullpage" className="c-topic">
        {topic.map(s => (
          <Section
            content={{ text: s.text, title: s.title, subtitle: s.subtitle }}
            imgURL={s.src}
            key={s.subtitle}
          />
        ))}
      </div>
    );
  }
}

Topic.propTypes = {
  topic: PropTypes.string
};

export default Topic;
