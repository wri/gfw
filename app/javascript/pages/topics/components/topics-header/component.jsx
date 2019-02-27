import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';

import Cover from 'components/cover';
import SubnavMenu from 'components/subnav-menu';
import Section from 'pages/topics/components/section';

import bgImage from './header-bg';

class TopicsHeader extends PureComponent {
  render() {
    const { topics } = this.props;
    return (
      <Section className="fp-auto-height">
        <Cover
          title="Topics"
          description="Explore the relationship between forests and several key themes critical to sustainability and the health of our
          future ecosystems."
          bgImage={bgImage}
        />
        <SubnavMenu links={topics} theme="theme-subnav-dark" checkActive />
      </Section>
    );
  }
}

TopicsHeader.propTypes = {
  topics: PropTypes.array
};

export default TopicsHeader;
