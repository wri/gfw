import React, { Component } from 'react';
import PropTypes from 'prop-types';
import Cover from 'components/cover';
import Button from 'components/button';

import bgImage from './header-bg';
import './about-cover-styles.scss';

class AboutCover extends Component {
  constructor(props) {
    super(props);

    this.state = {
      showVideo: false
    };
  }

  showVideo = () => {
    this.setState({ showVideo: true });
  };

  hideVideo = () => {
    this.setState({ showVideo: false });
  };

  render() {
    const video = (
      <div className="c-cover__video">
        <svg className="icon-close" onClick={this.hideVideo}>
          <use xlinkHref="#icon-close" />
        </svg>
        <iframe
          src="//www.youtube.com/embed/lTG-0brb98I?rel=0&autoplay=1&showinfo=0&controls=0&modestbranding=1"
          width="100%"
          height="100%"
          frameBorder="0"
          allowFullScreen
          title="About video"
        />
      </div>
    );

    return (
      <Cover
        title={this.props.title}
        description={this.props.description}
        bgImage={bgImage}
      >
        <div className="c-cover__play-button">
          <Button className="square" onClick={this.showVideo}>
            <svg className="icon">
              <use xlinkHref="#icon-play" />
            </svg>
          </Button>
          <span className="text -paragraph-4 -italic -color-7">
            GFW in 2 minutes
          </span>
          {this.state.showVideo ? video : null}
        </div>
      </Cover>
    );
  }
}

AboutCover.propTypes = {
  title: PropTypes.string.isRequired,
  description: PropTypes.string.isRequired
};

export default AboutCover;
