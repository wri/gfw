import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';

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
  render() {
    const { summary, uses, apps, news, newsLoading } = this.props;
    return (
      <div className="l-home-page">
        <Cover
          title="Forest Monitoring Designed for Action"
          description="Global Forest Watch offers the latest data, technology and tools that empower people everywhere to better protect forests."
          bgImage={bgImage}
          large
        >
          <Button className="scroll-to-btn" theme="square">
            <Icon icon={arrowIcon} />
          </Button>
        </Cover>
        <div className="row">
          <div className="column">
            <div className="section-summary">
              {summary && (
                <Carousel settings={{ dots: true }}>
                  {summary.map(c => (
                    <Card className="summary-card" key={c.title} data={c} />
                  ))}
                </Carousel>
              )}
            </div>
          </div>
        </div>
        <div className="section-uses">
          {uses && (
            <Carousel
              className="uses-carousel"
              settings={{
                slidesToShow: 1,
                dots: true,
                arrows: false,
                speed: 0,
                customPaging: i => (
                  <li className="use-user">
                    <Icon className="icon-user" icon={profileIcon} />
                    {uses[i].profile}
                  </li>
                )
              }}
            >
              {uses.map(c => (
                <div className="row expanded uses">
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
          <h3>BROWSE APPLICATIONS</h3>
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
              <h3 className="section-title">New on Global Forest Watch</h3>
              {newsLoading && <Loader className="news-loader" />}
              <div className="news-carousel">
                {!newsLoading && news ? (
                  <Carousel
                    settings={{
                      slidesToShow: 3
                    }}
                  >
                    {news.map(item => (
                      <Card
                        key={item.name}
                        className="news-card"
                        data={{
                          title: item.name,
                          summary: item.description,
                          extLink: item.link
                        }}
                      />
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
  uses: PropTypes.array.isRequired
};

export default Page;
