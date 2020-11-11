import React, { useState, useRef } from 'react';
import PropTypes from 'prop-types';
import YouTube from 'react-youtube';
import Link from 'next/link';
import cx from 'classnames';

import { Desktop, Mobile, Carousel, Button, Row, Column } from 'gfw-components';

import Cover from 'components/cover';
import Icon from 'components/ui/icon';
import Card from 'components/ui/card';
import NoContent from 'components/ui/no-content';

import arrowIcon from 'assets/icons/arrow-down.svg?sprite';
import profileIcon from 'assets/icons/profile.svg?sprite';
import mailIcon from 'assets/icons/mail.svg?sprite';

import config from './config';
import newsImage from './assets/news-bg.jpg';
import bgImage from './assets/home-bg.jpg';

import './styles.scss';

const HomePage = ({ summary, uses, apps, news }) => {
  const [showVideo, setShowVideo] = useState(false);
  const summaryEl = useRef(null);

  return (
    <div className="l-home-page">
      <Cover
        className="section-cover"
        title="Forest Monitoring Designed for Action"
        description="Global Forest Watch offers the latest data, technology and tools that empower people everywhere to better protect forests."
        bgImage={bgImage}
        bgAlt="View of the earth from space"
        large
      >
        <>
          <div className={cx('home-video', { '-show': showVideo })}>
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
                  iv_load_policy: 3,
                },
              }}
              onPlay={() => setTimeout(() => setShowVideo(true), 300)}
              onEnd={() => setShowVideo(false)}
            />
          </div>
          {showVideo && (
            <Button
              className="stop-video-btn"
              onClick={() => setShowVideo(false)}
            >
              STOP VIDEO
            </Button>
          )}
          <Link href="/subscribe">
            <a className="subscribe-link">
              <Button round className="subscribe-btn">
                <Icon icon={mailIcon} />
              </Button>
              <span className="subscribe-msg">
                SUBSCRIBE TO THE GFW NEWSLETTER
              </span>
            </a>
          </Link>
        </>
      </Cover>
      <Row>
        <Column>
          <div className="section-summary" ref={summaryEl}>
            <Button
              className="scroll-to-btn"
              round
              onClick={() => {
                window.scrollTo({
                  behavior: 'smooth',
                  left: 0,
                  top: summaryEl?.current?.offsetTop,
                });
              }}
            >
              <Icon icon={arrowIcon} />
            </Button>
            {summary && (
              <>
                <Desktop>
                  <Carousel settings={{ dots: true }}>
                    {summary.map((c) => (
                      <Card
                        className="summary-card"
                        key={c.title}
                        data={{ ...c, fullSummary: true }}
                      />
                    ))}
                  </Carousel>
                </Desktop>
                <Mobile>
                  <Carousel settings={{ dots: true, slidesToShow: 1 }}>
                    {summary.map((c) => (
                      <Card
                        className="summary-card"
                        key={c.title}
                        data={{ ...c, fullSummary: true }}
                      />
                    ))}
                  </Carousel>
                </Mobile>
              </>
            )}
          </div>
        </Column>
      </Row>
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
              customPaging: (i) => (
                <div className="use-user">
                  <Icon className="icon-user" icon={profileIcon} />
                  {uses[i].profile}
                </div>
              ),
            }}
          >
            {uses.map((c) => (
              <Row className="uses" key={c.example}>
                <Column width={[1, 1 / 2]}>
                  <p className="use-example">
                    <i>
                      <span>“</span>
                      {c.example}
                      <span>”</span>
                    </i>
                  </p>
                </Column>
                <Column width={[1, 1 / 2]}>
                  <div
                    className="use-image"
                    style={{ backgroundImage: `url(${c.img})` }}
                  >
                    <a
                      className="use-credit"
                      href={c.credit.extLink}
                      target="_blank"
                      rel="noopener noreferrer"
                    >
                      {c.credit.name}
                    </a>
                  </div>
                </Column>
              </Row>
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
              infinite: true,
            }}
          >
            {apps.map((app) => (
              <a
                key={app.title}
                href={app.extLink}
                target="_blank"
                rel="noopener noreferrer"
              >
                <div
                  className="app-slide"
                  style={{
                    backgroundColor: app.color,
                  }}
                >
                  <Row className="apps">
                    <Column>
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
                            backgroundImage: `url(${app.background})`,
                          }}
                        />
                      </div>
                    </Column>
                  </Row>
                </div>
              </a>
            ))}
          </Carousel>
        )}
      </div>
      <div
        className="section-news"
        style={{
          backgroundImage: `url(${newsImage})`,
        }}
      >
        <Row>
          <Column>
            <h3 className="news-title">New on Global Forest Watch</h3>
            <div className="news-carousel">
              {news ? (
                <>
                  <Desktop>
                    <Carousel
                      settings={{
                        slidesToShow: 3,
                      }}
                    >
                      {news.map((item) => (
                        <a
                          key={item.name}
                          href={item.link}
                          target="_blank"
                          className="news-card"
                          rel="noopener noreferrer"
                        >
                          <Card
                            data={{
                              title: item.name,
                              summary: item.description,
                            }}
                          />
                        </a>
                      ))}
                    </Carousel>
                  </Desktop>
                  <Mobile>
                    <Carousel
                      settings={{
                        slidesToShow: 1,
                      }}
                    >
                      {news.map((item) => (
                        <a
                          key={item.name}
                          href={item.link}
                          target="_blank"
                          className="news-card"
                          rel="noopener noreferrer"
                        >
                          <Card
                            data={{
                              title: item.name,
                              summary: item.description,
                            }}
                          />
                        </a>
                      ))}
                    </Carousel>
                  </Mobile>
                </>
              ) : (
                <NoContent className="no-news" message="No news available" />
              )}
            </div>
            <Link href="/my-gfw">
              <a>
                <Button className="my-gfw-btn" light>
                  My GFW
                </Button>
              </a>
            </Link>
          </Column>
        </Row>
      </div>
    </div>
  );
};

HomePage.propTypes = {
  summary: PropTypes.array.isRequired,
  apps: PropTypes.array.isRequired,
  news: PropTypes.array.isRequired,
  uses: PropTypes.array.isRequired,
};

HomePage.defaultProps = config;

export default HomePage;
