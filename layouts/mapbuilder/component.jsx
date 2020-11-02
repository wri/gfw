import React, { useState } from 'react';
import PropTypes from 'prop-types';
import ReactHtmlParser from 'react-html-parser';

import Link from 'next/link';

import { Button, Row, Column, Mobile, Desktop } from 'gfw-components';

import Cover from 'components/cover';
import Card from 'components/ui/card';

import './styles.scss';

const HomePage = ({ page, apps: allApps, tutorials }) => {
  const [showAllApps, setShowAllApps] = useState(false);
  const apps = showAllApps ? allApps : allApps.slice(0, 6);
  const showViewAllButton = allApps.length > 6 && !showAllApps;
  const {
    title,
    content,
    acf: {
      cover_image,
      background_image,
      summary,
      guide_section,
      maps_section,
      tutorials_section,
    },
  } = page || {};

  return (
    <div className="l-mapbuilder-page">
      <div
        className="image-overlay"
        style={{ backgroundImage: `url('${background_image?.url}')` }}
      />
      <Cover
        className="page-cover"
        title={title}
        description={ReactHtmlParser(content)}
        bgImage={cover_image?.url}
      />
      <div className="summary-section">
        <Row>
          {summary?.map((item) => (
            <Column key={item.title} width={[1, 1 / 2, 1 / 4]}>
              <div className="summary-card">
                <img
                  src={item?.icon?.url}
                  className="summary-icon"
                  alt={item?.title}
                />
                <h5 className="summary-title">{item?.title}</h5>
                <p className="summary-description">{item?.summary}</p>
              </div>
            </Column>
          ))}
        </Row>
      </div>
      <div className="guide-section">
        <Row>
          <Column>
            <h4 className="guide-title">{guide_section?.title}</h4>
          </Column>
          <Column>
            <p className="guide-intro">{guide_section?.subtitle}</p>
          </Column>
          {guide_section?.steps?.map((item, index) => (
            <Column
              key={item.summary}
              width={[1, 1 / 3]}
              className="guide-column"
            >
              <div className="guide-card">
                <span className="guide-number">{index + 1}</span>
                <p className="guide-text">{item.summary}</p>
              </div>
            </Column>
          ))}
          <Column width={[1 / 12, 1 / 3, 4.5 / 12]} />
          <Column width={[5 / 6, 1 / 3, 1 / 4]}>
            <Link href="https://www.globalforestwatch.org/help/mapbuilder/">
              <a>
                <Button className="column-btn">get started</Button>
              </a>
            </Link>
          </Column>
        </Row>
      </div>
      <div className="maps-section">
        <Row>
          <Column>
            <h4 className="maps-title">{maps_section?.title}</h4>
          </Column>
          <Column>
            <p className="maps-intro">{maps_section?.subtitle}</p>
          </Column>
          {apps?.map((item) => (
            <Column key={item.title} width={[1, 1 / 3]} className="maps-card">
              <a href={item.link} target="_blank" rel="noopener noreferrer">
                <Card
                  theme="theme-card-small"
                  data={{
                    ...item,
                    summary: ReactHtmlParser(item?.content),
                    image: item?.featured_media?.source_url,
                  }}
                />
              </a>
            </Column>
          ))}
          <Column>
            <Mobile>
              <Row nested>
                <Column width={[1 / 12]} />
                <Column width={[5 / 6]}>
                  <a href="mailto:gfw@wri.org">
                    <Button className="column-btn" light>
                      submit your map
                    </Button>
                  </a>
                </Column>
                <Column width={[1 / 12]} />
                {showViewAllButton && (
                  <>
                    <Column width={[1 / 12]} />
                    <Column width={[5 / 6]}>
                      <Button
                        className="column-btn"
                        onClick={() => setShowAllApps(true)}
                      >
                        view all
                      </Button>
                    </Column>
                  </>
                )}
              </Row>
            </Mobile>
            <Desktop>
              <Row nested>
                <Column width={[showViewAllButton ? 1 / 4 : 1 / 3]} />
                <Column width={[showViewAllButton ? 1 / 4 : 1 / 3]}>
                  <a href="mailto:gfw@wri.org">
                    <Button className="column-btn" light>
                      submit your map
                    </Button>
                  </a>
                </Column>
                {showViewAllButton && (
                  <>
                    <Column width={[1 / 4]}>
                      <Button
                        className="column-btn"
                        onClick={() => setShowAllApps(true)}
                      >
                        view all
                      </Button>
                    </Column>
                  </>
                )}
              </Row>
            </Desktop>
          </Column>
        </Row>
      </div>
      <div className="tutorials-section">
        <Row>
          <Column>
            <h4 className="tutorials-title">{tutorials_section?.title}</h4>
          </Column>
          <Column>
            <p className="tutorials-intro">{tutorials_section?.subtitle}</p>
          </Column>
          {tutorials?.map((item) => (
            <Column key={item.id} width={[1, 1 / 3]} className="tutorials-card">
              <a href={item.link}>
                <Card
                  theme="theme-card-small"
                  data={{
                    ...item,
                    summary: ReactHtmlParser(item?.excerpt),
                  }}
                />
              </a>
            </Column>
          ))}
          <Column width={[1 / 12, 1 / 3, 4.5 / 12]} />
          <Column width={[5 / 6, 1 / 3, 1 / 4]}>
            <Link href="https://www.globalforestwatch.org/help/mapbuilder/">
              <a>
                <Button className="column-btn">view all</Button>
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
  page: PropTypes.object.isRequired,
  tutorials: PropTypes.array.isRequired,
};

export default HomePage;
