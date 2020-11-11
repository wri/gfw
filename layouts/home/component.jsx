import PropTypes from 'prop-types';
import Link from 'next/link';

import { Desktop, Mobile, Carousel, Button, Row, Column } from 'gfw-components';

import Card from 'components/ui/card';
import NoContent from 'components/ui/no-content';

import newsImage from './assets/news-bg.jpg';

import HomeCover from './cover';
import HomeSummary from './summary';
import HomeUses from './uses';
import HomeApps from './apps';

import './styles.scss';

const HomePage = ({ news }) => {
  return (
    <div className="l-home-page">
      <HomeCover />
      <HomeSummary />
      <HomeUses />
      <HomeApps />

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
  news: PropTypes.array.isRequired,
};

export default HomePage;
