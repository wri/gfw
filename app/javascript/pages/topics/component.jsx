import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';
import ReactFullpage from '@fullpage/react-fullpage';
import { logEvent } from 'app/analytics';

import { Media } from 'utils/responsive';

import Button from 'components/ui/button';

import TopicsHeader from './components/topics-header';
import TopicsFooter from './components/topics-footer';
import TopicsSlide from './components/topics-slide';

import './styles.scss';

const anchors = ['intro', 'slides', 'footer'];

class TopicsPage extends PureComponent {
  state = {
    skip: false,
    slideLeaving: 0,
    leaving: false,
    showRelated:
      typeof window !== 'undefined' && window.location.hash.includes('slides'),
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
    const location =
      typeof window !== 'undefined' &&
      window.location.hash &&
      window.location.hash.split('/');
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
    }
    if (direction === 'up' && origin.anchor === 'slides' && slide !== 0) {
      this.fullpageApi.moveSlideLeft();
      return false;
    }

    if (direction === 'up') {
      this.setState({ slideLeaving: 0 });
    } else if (direction === 'down') {
      this.setState({ slideLeaving: 3 });
    }

    this.handleSetLeaving();

    return true;
  };

  handleMobileLeave = (origin, destination) => {
    if (destination.anchor === 'slides') {
      this.setState({ showRelated: true });
    } else {
      this.setState({ showRelated: false });
    }
    this.handleSetLeaving();
  };

  handleSlideLeave = (section, origin) => {
    this.setState({ slideLeaving: origin.index });
    this.handleSetLeaving();
  };

  handleSkipToTools = (source) => {
    this.setState({ skip: true }, () => {
      this.fullpageApi.moveTo('footer');
    });
    logEvent('topicsRelatedTools', {
      label: source,
    });
  };

  handleSetLeaving = () => {
    this.setState({ leaving: true });
    setTimeout(() => {
      this.setState({
        leaving: false,
      });
    }, 500);
  };

  renderFullPageContent = (fullpageApi, isDesktop) => {
    const { links, topicData, title } = this.props;
    const { cards, slides, intro } = topicData || {};

    return (
      <ReactFullpage.Wrapper>
        <div className="topic-header section">
          <TopicsHeader
            topics={links}
            intro={intro}
            fullpageApi={fullpageApi}
            title={title}
            handleSkipToTools={() => this.handleSkipToTools('intro')}
          />
        </div>
        <div className="topic-slides section">
          {slides &&
            slides.map((s, index) => (
              <TopicsSlide
                key={s.subtitle}
                {...s}
                index={index}
                isLeaving={this.state.slideLeaving === index}
                isLast={index === 3}
                handleSkipToTools={() =>
                  this.handleSkipToTools(`${s.title}: ${s.subtitle}`)}
                leaving={this.state.leaving}
                isDesktop={isDesktop}
              />
            ))}
        </div>
        <div className="topic-footer section">
          <TopicsFooter cards={cards} topic={title} />
        </div>
      </ReactFullpage.Wrapper>
    );
  };

  render() {
    return (
      <div className="l-topics-page">
        {this.state.showRelated && (
          <Media lessThan="md">
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
          </Media>
        )}
        <Media greaterThanOrEqual="md">
          <ReactFullpage
            licenseKey={process.env.FULLPAGE_LICENSE}
            scrollOverflow
            anchors={anchors}
            animateAnchor={false}
            onLeave={this.handleLeave}
            onSlideLeave={this.handleSlideLeave}
            controlArrows={false}
            render={({ fullpageApi }) => {
              if (!this.fullpageApi) {
                this.fullpageApi = fullpageApi;
              }

              return this.renderFullPageContent(fullpageApi, true);
            }}
          />
        </Media>
        <Media lessThan="md">
          <ReactFullpage
            licenseKey={process.env.FULLPAGE_LICENSE}
            scrollOverflow
            anchors={anchors}
            animateAnchor={false}
            onLeave={this.handleMobileLeave}
            onSlideLeave={this.handleSlideLeave}
            controlArrows={false}
            render={({ fullpageApi }) => {
              if (!this.fullpageApi) {
                this.fullpageApi = fullpageApi;
              }

              return this.renderFullPageContent(fullpageApi);
            }}
          />
        </Media>
      </div>
    );
  }
}

TopicsPage.propTypes = {
  links: PropTypes.array.isRequired,
  topicData: PropTypes.object,
  title: PropTypes.string,
};

export default TopicsPage;
