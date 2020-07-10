import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';

import Cover from 'components/cover';
import SubnavMenu from 'components/subnav-menu';
import arrowIcon from 'assets/icons/arrow-down.svg?sprite';
import Icon from 'components/ui/icon';
import Button from 'components/ui/button';

import bgImage from 'pages/topics/assets/bg-leaf.jpeg?webp';

import Intro from './topics-intro';

import './styles.scss';

class TopicsHeader extends PureComponent {
  render() {
    const { topics, intro, fullpageApi, title, handleSkipToTools } = this.props;
    return (
      <div className="c-topics-header">
        <div className="intro-top">
          <Cover
            title="Topics"
            description="Explore the relationship between forests and several key themes critical to sustainability and the health of our
            future ecosystems."
            bgImage={bgImage}
          />
          <SubnavMenu links={topics} theme="theme-subnav-dark" />
          <Intro
            className={title}
            intro={intro}
            handleSkipToTools={handleSkipToTools}
          />
        </div>
        <div className="intro-bottom">
          <div className="row">
            <div className="column small-12 medium-12">
              <div className="scroll-to-discover">
                <Button
                  className="scroll-btn"
                  onClick={() => {
                    fullpageApi.moveSectionDown();
                  }}
                >
                  <Icon icon={arrowIcon} />
                </Button>
                <p>Scroll to discover</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }
}

TopicsHeader.propTypes = {
  topics: PropTypes.array,
  intro: PropTypes.object,
  fullpageApi: PropTypes.object,
  title: PropTypes.string,
  handleSkipToTools: PropTypes.func,
};

export default TopicsHeader;
