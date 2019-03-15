import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';
import ReactFullpage from '@fullpage/react-fullpage';
import cx from 'classnames';

import MediaQuery from 'react-responsive';
import { SCREEN_M } from 'utils/constants';

import Header from 'components/header';
import TopicsHeader from 'pages/topics/components/topics-header';
import TopicsFooter from 'pages/topics/components/topics-footer';
import Text from 'pages/topics/components/topics-text';
import Image from 'pages/topics/components/topics-image';
import Button from 'components/ui/button';

import scrollOverflow from './vendors/scrolloverflow.min';

import './styles.scss';

const anchors = ['intro', 'slides', 'footer'];
const pluginWrapper = () => ({
  scrollOverflow
});

class TopicsPage extends PureComponent {
  state = {
    skip: false,
    slideLeaving: 0,
    showRelated: window.location.hash.includes('slides')
  };

  componentDidUpdate(prevProps) {
    const { title } = this.props;
    if (this.fullpageApi && title !== prevProps.title) {
      this.resetState();
      this.fullpageApi.reBuild();
    }
  }

  resetState = () => {
    this.setState({ skip: false, slideLeaving: 0 });
  };

  handleLeave = (origin, destination, direction) => {
    const location = window.location.hash && window.location.hash.split('/');
    const slide =
      (location && location.length > 1 && parseInt(location[1], 10)) || 0;

    if (origin.anchor === 'intro' && destination.anchor === 'footer') {
      this.setState({ skip: false });
      return true;
    }

    if (this.state.skip) {
      this.setState({ skip: false, slideLeaving: slide });
      this.fullpageApi.moveTo('slides', 3);
      return true;
    }

    if (origin.anchor !== 'slides') {
      return true;
    }

    if (direction === 'down' && origin.anchor === 'slides' && slide !== 3) {
      this.fullpageApi.moveSlideRight();
      return false;
    } else if (
      direction === 'up' &&
      origin.anchor === 'slides' &&
      slide !== 0
    ) {
      this.fullpageApi.moveSlideLeft();
      return false;
    }

    if (direction === 'up') {
      this.setState({ slideLeaving: 0 });
    } else if (direction === 'down') {
      this.setState({ slideLeaving: 3 });
    }

    return true;
  };

  handleMobileLeave = (origin, destination) => {
    if (destination.anchor === 'slides') {
      this.setState({ showRelated: true });
    } else {
      this.setState({ showRelated: false });
    }
  };

  handleSlideLeave = (section, origin) => {
    this.setState({ slideLeaving: origin.index });
  };

  handleSkipToTools = () => {
    this.setState({ skip: true }, () => {
      this.fullpageApi.moveTo('footer');
    });
  };

  getSlide = (s, index, isDesktop) => (
    <div
      key={s.subtitle}
      className={cx({ last: index === 3 }, { slide: isDesktop })}
    >
      <div className="row">
        <div className="column small-12 medium-4">
          <div className="topic-content">
            <Text
              className={cx({
                leaving: this.state.slideLeaving === index
              })}
              text={s.text}
              title={s.title}
              subtitle={s.subtitle}
            />
            {isDesktop && (
              <Button
                className="topic-btn"
                theme="theme-button-light"
                onClick={this.handleSkipToTools}
              >
                Related tools
              </Button>
            )}
          </div>
        </div>
        <div className="column small-12 medium-8">
          <div className="topic-image">
            <Image url={s.src} description={s.subtitle} prompts={s.prompts} />
          </div>
        </div>
      </div>
    </div>
  );

  render() {
    const { links, topicData, title } = this.props;
    const { cards, slides, intro } = topicData || {};

    return (
      <MediaQuery minWidth={SCREEN_M}>
        {isDesktop => (
          <div className="l-topics-page">
            <Header isMobile={!isDesktop} />
            {!isDesktop &&
              this.state.showRelated && (
                <div className="related-tools-btn">
                  <Button
                    theme="theme-button-light"
                    onClick={() => {
                      this.fullpageApi.moveSectionDown();
                    }}
                  >
                    Related Tools
                  </Button>
                </div>
              )}
            <ReactFullpage
              pluginWrapper={pluginWrapper}
              scrollOverflow
              anchors={anchors}
              animateAnchor={false}
              slidesNavigation={isDesktop}
              onLeave={isDesktop ? this.handleLeave : this.handleMobileLeave}
              onSlideLeave={this.handleSlideLeave}
              render={({ fullpageApi }) => {
                this.fullpageApi = fullpageApi;

                return (
                  <ReactFullpage.Wrapper>
                    <div className="header-section section">
                      <TopicsHeader
                        topics={links}
                        intro={intro}
                        fullpageApi={fullpageApi}
                        title={title}
                        handleSkipToTools={this.handleSkipToTools}
                        isDesktop={isDesktop}
                      />
                    </div>
                    <div className="slides section">
                      {slides &&
                        slides.map((s, index) =>
                          this.getSlide(s, index, isDesktop)
                        )}
                    </div>
                    <div className="section">
                      <TopicsFooter cards={cards} topic={title} />
                    </div>
                  </ReactFullpage.Wrapper>
                );
              }}
            />
          </div>
        )}
      </MediaQuery>
    );
  }
}

TopicsPage.propTypes = {
  links: PropTypes.array.isRequired,
  topicData: PropTypes.object,
  title: PropTypes.string
};

export default TopicsPage;
