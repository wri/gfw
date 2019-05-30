import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';

import Cover from 'components/cover';
import Button from 'components/ui/button';
import Icon from 'components/ui/icon';
import Carousel from 'components/ui/carousel';
import Card from 'components/ui/card';

import arrowIcon from 'assets/icons/arrow-down.svg';
import profileIcon from 'assets/icons/profile.svg';

import HistorySection from 'pages/about/section-history';
import Impacts from 'pages/about/section-impacts';
import Partners from 'pages/about/section-partners';
import How from 'pages/about/section-how';
import Contact from 'pages/about/section-contact';

import bgImage from './assets/home-bg.jpg';
import './styles.scss';

const sectionComponents = {
  history: HistorySection,
  impacts: Impacts,
  partners: Partners,
  how: How,
  contact: Contact
};

class Page extends PureComponent {
  // eslint-disable-line react/prefer-stateless-function
  render() {
    const { sections, summary, uses } = this.props;
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
                    {/* <div className="use-card">

                    </div> */}
                  </div>
                </div>
              ))}
            </Carousel>
          )}
        </div>
      </div>
    );
  }
}

Page.propTypes = {
  sections: PropTypes.array.isRequired
};

export default Page;
