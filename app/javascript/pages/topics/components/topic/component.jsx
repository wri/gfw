import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';
import ReactFullpage from '@fullpage/react-fullpage';

import Section from 'pages/topics/components/section';
import Biodiversity from 'pages/topics/content/biodiversity.json';

class Topic extends PureComponent {
  render() {
    const topics = {
      Biodiversity
    };
    const topic = topics[this.props.topic] || [];
    return (
      <ReactFullpage
        // fitToSection={false}
        // scrollOverflow
        // verticalCentered={false}
        // paddingTop={400}
        // normalScrollElements=".c-header, .c-cover, .c-subnav-menu"
        fixedElements=".c-header"
        render={
          // ({ state, fullpageApi }) => (
          () => (
            <ReactFullpage.Wrapper>
              {topic.map((s, i) => (
                <Section
                  content={{
                    text: s.text,
                    title: s.title,
                    subtitle: s.subtitle
                  }}
                  imgURL={s.src}
                  key={s.subtitle}
                  index={i}
                />
              ))}
            </ReactFullpage.Wrapper>
          )
        }
      />
    );
  }
}

Topic.propTypes = {
  topic: PropTypes.string
};

export default Topic;
