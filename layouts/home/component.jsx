import PropTypes from 'prop-types';
import Link from 'next/link';
import cx from 'classnames';

import { Desktop, Mobile, Carousel, Button, Row, Column } from 'gfw-components';

import Icon from 'components/ui/icon';
import Card from 'components/ui/card';
import NoContent from 'components/ui/no-content';

import config from './config';
import newsImage from './assets/news-bg.jpg';

import HomeCover from './cover';
import HomeSummary from './summary';
import HomeUses from './uses';

import './styles.scss';

const HomePage = ({ apps, news }) => {
  return (
    <div className="l-home-page">
      <HomeCover />
      <HomeSummary />
      <HomeUses />
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
  apps: PropTypes.array.isRequired,
  news: PropTypes.array.isRequired,
};

HomePage.defaultProps = config;

export default HomePage;
