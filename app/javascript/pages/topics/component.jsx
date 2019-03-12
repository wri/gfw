import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';
import cx from 'classnames';

import Header from 'components/header';
import TopicsHeader from 'pages/topics/components/topics-header';
import TopicsFooter from 'pages/topics/components/topics-footer';
import Section from 'pages/topics/components/section';
import Text from 'pages/topics/components/topics-text';
import Image from 'pages/topics/components/topics-image';
import Button from 'components/ui/button';

import './styles.scss';

class TopicsPage extends PureComponent {
  componentDidMount() {
    this.anchors = ['intro', '1', '2', '3', 'footer'];
    /* global $ */
    $(document).ready(() => {
      $('#fullpage').fullpage({
        scrollOverflow: true,
        navigation: true,
        navigationPosition: 'right',
        anchors: this.anchors,
        // onLeave: (origin, destination, direction) => {}
        onLeave: () => this.handleLeave(),
        // afterLoad 3.X: (origin, destination, direction) => {}
        afterLoad: (section, index) => this.slideDidLoad(section, index)
      });
      $('#fp-nav').hide();
    });
  }

  slideDidLoad(section, index) {
    // Hide navigation dots
    if (index === 1) {
      $('#fp-nav').hide();
    } else {
      $('#fp-nav').show();
    }
    // Lock scroll on intro section
    if (index === 1) {
      $('#fullpage').fullpage.setAllowScrolling(false);
    } else {
      $('#fullpage').fullpage.setAllowScrolling(true);
    }
    // Text animation (topics-text/styles.scss)
    if (this.activeSection) this.activeSection.classList.remove('leaving');
    this.activeSection = document.querySelectorAll('.section')[section];
  }

  handleLeave() {
    if (this.activeSection) this.activeSection.classList.add('leaving');
  }

  render() {
    const { links, topicData } = this.props;
    const { cards, slides, intro } = topicData || {};

    return (
      <div className="l-topics-page">
        <Header />
        <div id="fullpage">
          <TopicsHeader topics={links} intro={intro} />
          {slides &&
            slides.map((s, index) => {
              const isFooter = index === 3;
              return (
                <Section
                  key={s.subtitle}
                  anchors={this.anchors}
                  className={cx(isFooter && 'fp-auto-height topics-footer')}
                >
                  <div className={cx(isFooter && 'fullpage-view')}>
                    <div className="row">
                      <div className="column small-12 medium-4">
                        <div className="topic-content">
                          <Text
                            text={s.text}
                            title={s.title}
                            subtitle={s.subtitle}
                          />
                          {!isFooter && (
                            <Button
                              theme="theme-button-grey topics-btn"
                              onClick={() => {
                                /* global $ */
                                $('#fullpage').fullpage.moveTo('footer', 0);
                              }}
                            >
                              Skip
                            </Button>
                          )}
                        </div>
                      </div>
                      <div className="column small-12 medium-8 topic-image">
                        <Image url={s.src} description={s.subtitle} />
                      </div>
                    </div>
                  </div>
                  {index === 3 && <TopicsFooter cards={cards} />}
                </Section>
              );
            })}
        </div>
      </div>
    );
  }
}

TopicsPage.propTypes = {
  links: PropTypes.array.isRequired,
  topicData: PropTypes.object
};

export default TopicsPage;
