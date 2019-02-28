import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';

import Cover from 'components/cover';
import SubnavMenu from 'components/subnav-menu';
import Intro from 'pages/topics/components/intro';
import Section from 'pages/topics/components/section';

import bgImage from 'pages/topics/assets/header-bg';

// import './styles.scss';

class TopicsHeader extends PureComponent {
  render() {
    const { topics } = this.props;
    return (
      <Section className="fp-auto-height-responsive">
        <Cover
          title="Topics"
          description="Explore the relationship between forests and several key themes critical to sustainability and the health of our
          future ecosystems."
          bgImage={bgImage}
        />
        <SubnavMenu links={topics} theme="theme-subnav-dark" checkActive />
        <Intro />
      </Section>
    );
  }
}

TopicsHeader.propTypes = {
  topics: PropTypes.array
};

export default TopicsHeader;
