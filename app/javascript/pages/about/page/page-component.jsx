import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';

import Cover from 'components/cover';
import SubnavMenu from 'components/subnav-menu';
import Projects from 'pages/about/section-projects';
import Join from 'pages/about/section-join';
import Button from 'components/ui/button';
import Icon from 'components/ui/icon';
import ModalVideo from 'components/modals/video';

import playIcon from 'assets/icons/play.svg';
import bgImage from './header-bg';
import './page-styles.scss';

class Page extends PureComponent {
  // eslint-disable-line react/prefer-stateless-function

  render() {
    const { sections, setModalVideoData } = this.props;
    return (
      <div className="l-main">
        <Cover
          title="About"
          description="Global Forest Watch (GFW) is an online platform that provides data and tools for monitoring forests. By harnessing cutting-edge technology, GFW allows anyone to access near real-time information about where and how forests are changing around the world."
          bgImage={bgImage}
        >
          <div className="video">
            <Button
              theme="square"
              className="video-btn"
              onClick={() =>
                setModalVideoData({
                  open: true,
                  data: {
                    src:
                      '//www.youtube.com/embed/lTG-0brb98I?rel=0&autoplay=1&showinfo=0&controls=0&modestbranding=1'
                  }
                })
              }
            >
              <Icon icon={playIcon} />
            </Button>
            <p className="video-msg">GFW in 2&#39;</p>
          </div>
        </Cover>
        <SubnavMenu className="about-links" links={sections} />
        <Projects />
        {sections.map(s => (
          <div id={s.anchor} className={s.anchor} key={s.anchor}>
            {s.component && <s.component />}
          </div>
        ))}
        <Join />
        <ModalVideo />
      </div>
    );
  }
}

Page.propTypes = {
  sections: PropTypes.array.isRequired,
  setModalVideoData: PropTypes.func.isRequired
};

export default Page;
