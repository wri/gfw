import React, { useState } from 'react';
import PropTypes from 'prop-types';
import ReactHtmlParser from 'react-html-parser';
import cx from 'classnames';

import Link from 'next/link';

import Cover from 'components/cover';
import Button from 'components/ui/button';
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
        <div className="row">
          {summary?.map((item) => (
            <div key={item.title} className="column small-12 medium-6 large-3 ">
              <div className="summary-card">
                <img
                  src={item?.icon?.url}
                  className="summary-icon"
                  alt={item?.title}
                />
                <h5 className="summary-title">{item?.title}</h5>
                <p className="summary-description">{item?.summary}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
      <div className="guide-section">
        <div className="row">
          <div className="column small-12">
            <h4 className="guide-title">{guide_section?.title}</h4>
          </div>
          <div className="column small-12">
            <p className="guide-intro">{guide_section?.subtitle}</p>
          </div>
          {guide_section?.steps?.map((item, index) => (
            <div
              key={item.summary}
              className="column small-12 medium-4 guide-column"
            >
              <div className="guide-card">
                <span className="guide-number">{index + 1}</span>
                <p className="guide-text">{item.summary}</p>
              </div>
            </div>
          ))}
          <div className="column small-10 small-offset-1 medium-4 medium-offset-4 large-2 large-offset-5">
            <Link href="https://www.globalforestwatch.org/help/mapbuilder/">
              <a>
                <Button className="column-btn">get started</Button>
              </a>
            </Link>
          </div>
        </div>
      </div>
      <div className="maps-section">
        <div className="row">
          <div className="column small-12">
            <h4 className="maps-title">{maps_section?.title}</h4>
          </div>
          <div className="column small-12">
            <p className="maps-intro">{maps_section?.subtitle}</p>
          </div>
          {apps?.map((item) => (
            <div
              key={item.title}
              className="column small-12 medium-4 maps-card"
            >
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
            </div>
          ))}
          <div className="column small-12">
            <div className="row">
              <div
                className={cx(
                  'column small-10 small-offset-1 medium-3 medium-offset-3',
                  { 'medium-4 medium-offset-4': !showViewAllButton }
                )}
              >
                <a href="mailto:gfw@wri.org">
                  <Button className="column-btn" theme="theme-button-light">
                    submit your map
                  </Button>
                </a>
              </div>
              {showViewAllButton && (
                <div className="column small-10 small-offset-1 medium-3 medium-offset-0">
                  <Button
                    className="column-btn"
                    onClick={() => setShowAllApps(true)}
                  >
                    view all
                  </Button>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
      <div className="tutorials-section">
        <div className="row">
          <div className="column small-12">
            <h4 className="tutorials-title">{tutorials_section?.title}</h4>
          </div>
          <div className="column small-12">
            <p className="tutorials-intro">{tutorials_section?.subtitle}</p>
          </div>
          {tutorials?.map((item) => (
            <div
              key={item.id}
              className="column small-12 medium-4 tutorials-card"
            >
              <a href={item.link}>
                <Card
                  theme="theme-card-small"
                  data={{
                    ...item,
                    summary: ReactHtmlParser(item?.excerpt),
                  }}
                />
              </a>
            </div>
          ))}
          <div className="column small-10 small-offset-1 medium-4 medium-offset-4 large-2 large-offset-5">
            <Link href="https://www.globalforestwatch.org/help/mapbuilder/">
              <a>
                <Button className="column-btn">view all</Button>
              </a>
            </Link>
          </div>
        </div>
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
