import React, { Component } from 'react';
import PropTypes from 'prop-types'

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
    const video = <div className="c-about-cover__video">
      <svg className="icon-close" onClick={this.hideVideo}><use xlinkHref="#icon-close"></use></svg>
      <iframe src="//www.youtube.com/embed/lTG-0brb98I?rel=0&autoplay=1&showinfo=0&controls=0&modestbranding=1" width="100%" height="100%" frameBorder="0" allowFullScreen></iframe>
    </div>;

    return (
      <div className="c-about-cover">
        <div className="row">
          <div className="small-12 columns">
            <div className="c-about-cover-texts">
              <h1 className="text -title-biggest -color-1">{this.props.title}</h1>
              <p className="c-about-cover__description text -paragraph -color-1">{this.props.description}</p>
              <div className="c-about-cover__play-button">
                <div className="c-play-button" onClick={this.showVideo}>
                  <svg className="icon">
                    <use xlinkHref="#icon-play"></use>
                  </svg>
                </div>
                <span className="text -paragraph-4 -italic -color-7">GFW in 2 minutes</span>
              </div>
            </div>
          </div>
        </div>
        {this.state.showVideo ? video : null}
      </div>
    )
  }
}

AboutCover.propTypes = {
  title: PropTypes.string.isRequired,
  description: PropTypes.string.isRequired
};

export default AboutCover;
