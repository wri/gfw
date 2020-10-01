import React from 'react';
import PropTypes from 'prop-types';
import ReactHtmlParser from 'react-html-parser';

import Link from 'next/link';

import Cover from 'components/cover';
import Button from 'components/ui/button';
import Icon from 'components/ui/icon';
import Card from 'components/ui/card';

import bgImage from './assets/home-background.png?webp';
import bgAtlas from './assets/bkg-own-atlas.jpg';

import './styles.scss';

const HomePage = ({ summary, guide, maps, tutorials }) => (
  <div className="l-mapbuilder-page">
    <div
      className="image-overlay"
      style={{ backgroundImage: `url('${bgAtlas}')` }}
    />
    <Cover
      className="page-cover"
      title="MapBuilder"
      description="Want to create a version of the Global Forest Watch map, featuring your own data? MapBuilder is an easy to use tool which enables users to combine their own datasets with GFW’s cutting-edge data and analysis tools."
      bgImage={bgImage}
    />
    <div className="summary-section">
      <div className="row">
        {summary.map((item) => (
          <div key={item.title} className="column small-12 medium-6 large-3 ">
            <div className="summary-card">
              <Icon icon={item.icon} className="summary-icon" />
              <h5 className="summary-title">{item.title}</h5>
              <p className="summary-description">{item.summary}</p>
            </div>
          </div>
        ))}
      </div>
    </div>
    <div className="guide-section">
      <div className="row">
        <div className="column small-12">
          <h4 className="guide-title">Start building your GFW MapBuilder</h4>
        </div>
        <div className="column small-12">
          <p className="guide-intro">
            Here&apos;s your 1-2-3 guide on getting started.
          </p>
        </div>
        {guide.map((item, index) => (
          <div key={item.key} className="column small-12 medium-4 guide-column">
            <div className="guide-card">
              <span className="guide-number">{index + 1}</span>
              <p className="guide-text">{item.text}</p>
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
          <h4 className="maps-title">Featured maps</h4>
        </div>
        <div className="column small-12">
          <p className="maps-intro">
            A hand-picked selection of GFW maps and applications built by our
            user community. Imagine your map or app here!
          </p>
        </div>
        {maps.map((item) => (
          <div key={item.title} className="column small-12 medium-4 maps-card">
            <a href={item.extLink} target="_blank" rel="noopener noreferrer">
              <Card theme="theme-card-small" data={item} />
            </a>
          </div>
        ))}
        <div className="column small-12">
          <div className="row">
            <div className="column small-10 small-offset-1 medium-3 medium-offset-3">
              <a href="mailto:gfw@wri.org">
                <Button className="column-btn" theme="theme-button-light">
                  submit your map
                </Button>
              </a>
            </div>
            <div className="column small-10 small-offset-1 medium-3 medium-offset-0">
              <Link href="https://www.globalforestwatch.org/help/mapbuilder/">
                <a>
                  <Button className="column-btn">view all</Button>
                </a>
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
    <div className="tutorials-section">
      <div className="row">
        <div className="column small-12">
          <h4 className="tutorials-title">Tutorials</h4>
        </div>
        <div className="column small-12">
          <p className="tutorials-intro">
            Just getting started? Or need some help? Our tutorials will get you
            pointed in the right direction.
          </p>
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
                  summary: ReactHtmlParser(item?.excerpt?.rendered),
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

HomePage.propTypes = {
  summary: PropTypes.array.isRequired,
  guide: PropTypes.array.isRequired,
  maps: PropTypes.array.isRequired,
  tutorials: PropTypes.array.isRequired,
};

export default HomePage;
