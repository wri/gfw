import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';

import Cover from 'components/cover';
import SubnavMenu from 'components/subnav-menu';
import Intro from 'pages/topics/components/intro';
import Section from 'pages/topics/components/section';
import arrowIcon from 'assets/icons/arrow-down.svg';
import Icon from 'components/ui/icon';
import Button from 'components/ui/button';

import bgImage from 'pages/topics/assets/header-bg';

import './styles.scss';

class TopicsHeader extends PureComponent {
  render() {
    const { topics, intro } = this.props;
    return (
      <Section className="fp-auto-height-responsive topics-header">
        <div className="intro-top">
          <Cover
            title="Topics"
            description="Explore the relationship between forests and several key themes critical to sustainability and the health of our
            future ecosystems."
            bgImage={bgImage}
          />
          <SubnavMenu links={topics} theme="theme-subnav-dark" />
          <Intro intro={intro} />
        </div>
        <div className="intro-bottom">
          <div className="row">
            <div className="column small-12 medium-12">
              <div className="scrollToDiscover">
                <Button
                  onClick={() => {
                    /* global $ */
                    $('#fullpage').fullpage.moveSectionDown();
                  }}
                >
                  <Icon icon={arrowIcon} />
                </Button>
                <p>Click to discover</p>
              </div>
            </div>
          </div>
        </div>
      </Section>
    );
  }
}

TopicsHeader.propTypes = {
  topics: PropTypes.array,
  intro: PropTypes.object
};

export default TopicsHeader;
