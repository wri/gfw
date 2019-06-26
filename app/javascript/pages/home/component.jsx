import React, { PureComponent, Fragment } from 'react';
import PropTypes from 'prop-types';
import YouTube from 'react-youtube';
import cx from 'classnames';

import NewsProvider from 'providers/news-provider';

import Cover from 'components/cover';
import Button from 'components/ui/button';
import Icon from 'components/ui/icon';
import Carousel from 'components/ui/carousel';
import Card from 'components/ui/card';
import Loader from 'components/ui/loader';
import NoContent from 'components/ui/no-content';

import arrowIcon from 'assets/icons/arrow-down.svg';
import profileIcon from 'assets/icons/profile.svg';

import newsImage from './assets/news-bg.jpg';
import bgImage from './assets/home-bg.jpg';
import './styles.scss';

class Page extends PureComponent {
  // eslint-disable-line react/prefer-stateless-function
  state = {
    showVideo: false
  };

  render() {
    const { summary, uses, apps, news, newsLoading, isDesktop } = this.props;

    return (
      <div className="l-home-page">
        <Cover
          className="home-cover"
          title="Forest Monitoring Designed for Action"
          description="Global Forest Watch offers the latest data, technology and tools that empower people everywhere to better protect forests."
          bgImage={bgImage}
          large
        >
          {isDesktop && (
            <Fragment>
              <div className={cx('home-video', { show: this.state.showVideo })}>
                <YouTube
                  videoId="0XsJNU75Si0"
                  opts={{
                    height: '100%',
                    width: '100%',
                    playerVars: {
                      autoplay: 1,
                      autohide: 1,
                      loop: 1,
                      modestbranding: 1,
                      rel: 0,
                      showinfo: 0,
                      controls: 0,
                      disablekb: 1,
                      enablejsapi: 0,
                      iv_load_policy: 3
                    }
                  }}
                  onPlay={() =>
                    setTimeout(() => this.setState({ showVideo: true }), 300)
                  }
                  onEnd={() => this.setState({ showVideo: false })}
                />
              </div>
              {this.state.showVideo && (
                <Button
                  className="stop-video-btn"
                  onClick={() => {
                    this.setState({ showVideo: false });
                  }}
                >
                  STOP VIDEO
                </Button>
              )}
            </Fragment>
          )}
        </Cover>
        <div
          className="row"
          ref={ref => {
            this.uses = ref;
          }}
        >
          <div className="column">
            <div className="section-summary">
              <Button
                className="scroll-to-btn"
                theme="square"
                onClick={() => {
                  window.scrollTo({
                    behavior: 'smooth',
                    left: 0,
                    top: this.uses.offsetTop
                  });
                }}
              >
                <Icon icon={arrowIcon} />
              </Button>
              {summary && (
                <Carousel settings={{ dots: true }}>
                  {summary.map(c => (
                    <Card
                      className="summary-card"
                      key={c.title}
                      data={{ ...c, fullSummary: true }}
                    />
                  ))}
                </Carousel>
              )}
            </div>
          </div>
        </div>
        <div className="section-uses">
          <h3 className="section-title">
            What can you do with Global Forest Watch?
          </h3>
          {uses && (
            <Carousel
              className="uses-carousel"
              settings={{
                slidesToShow: 1,
                dots: true,
                arrows: false,
                speed: 0,
                customPaging: i => (
                  <div className="use-user">
                    <Icon className="icon-user" icon={profileIcon} />
                    {uses[i].profile}
                  </div>
                )
              }}
            >
              {uses.map(c => (
                <div className="row expanded uses" key={c.example}>
                  <div className="column small-12 medium-6">
                    <p className="use-example">
                      <i>
                        <span>“</span>
                        {c.example}
                        <span>”</span>
                      </i>
                    </p>
                  </div>
                  <div className="column small-12 medium-6">
                    <div
                      className="use-image"
                      style={{ backgroundImage: `url(${c.img})` }}
                    >
                      <a
                        className="use-credit"
                        href={c.credit.extLink}
                        target="_blank"
                        rel="noopener nofollower"
                      >
                        {c.credit.name}
                      </a>
                    </div>
                  </div>
                </div>
              ))}
            </Carousel>
          )}
        </div>
        <div className="section-apps">
          <h3 className="section-title">BROWSE APPLICATIONS</h3>
          {apps && (
            <Carousel
              className="apps-carousel"
              settings={{
                slidesToShow: 1,
                infinite: true
              }}
            >
              {apps.map(app => (
                <a
                  key={app.title}
                  href={app.extLink}
                  target="_blank"
                  rel="noopener nofollower"
                >
                  <div
                    className="app-slide"
                    style={{
                      backgroundColor: app.color
                    }}
                  >
                    <div className="row apps">
                      <div className="column small-12">
                        <div className="app-content">
                          <Icon
                            className={cx('app-icon', app.className)}
                            icon={app.icon}
                          />
                          <h4>{app.title}</h4>
                          <p>{app.description}</p>
                          <div
                            className="app-image"
                            style={{
                              backgroundImage: `url(${app.background})`
                            }}
                          />
                        </div>
                      </div>
                    </div>
                  </div>
                </a>
              ))}
            </Carousel>
          )}
        </div>
        <div
          className="section-news"
          style={{
            backgroundImage: `url(${newsImage})`
          }}
        >
          <div className="row">
            <div className="column small-12">
              <h3 className="news-title">New on Global Forest Watch</h3>
              {newsLoading && <Loader className="news-loader" />}
              <div className="news-carousel">
                {!newsLoading && news ? (
                  <Carousel
                    settings={{
                      slidesToShow: 3
                    }}
                  >
                    {news.map(item => (
                      <a
                        key={item.name}
                        href={item.link}
                        target="_blank"
                        rel="noopener nofollower"
                      >
                        <Card
                          className="news-card"
                          data={{
                            title: item.name,
                            summary: item.description
                          }}
                        />
                      </a>
                    ))}
                  </Carousel>
                ) : (
                  <NoContent className="no-news" message="No news available" />
                )}
              </div>
              <Button
                className="my-gfw-btn"
                theme="theme-button-light"
                extLink="/my_gfw"
              >
                My GFW
              </Button>
            </div>
          </div>
        </div>
        <NewsProvider />
      </div>
    );
  }
}

Page.propTypes = {
  summary: PropTypes.array.isRequired,
  apps: PropTypes.array.isRequired,
  news: PropTypes.array,
  newsLoading: PropTypes.bool,
  uses: PropTypes.array.isRequired,
  isDesktop: PropTypes.bool
};

export default Page;
