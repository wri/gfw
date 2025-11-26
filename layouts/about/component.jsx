import React from 'react';
import Link from 'next/link';

import { Button } from '@worldresources/gfw-components';

import Cover from 'components/cover';
import SubnavMenu from 'components/subnav-menu';
import Icon from 'components/ui/icon';

import Projects from 'layouts/about/projects';
import How from 'layouts/about/how';
import Impacts from 'layouts/about/impacts';
import HistorySection from 'layouts/about/history';
import Contact from 'layouts/about/contact';
import Partners from 'layouts/about/partners';
import Join from 'layouts/about/join';

import mailIcon from 'assets/icons/mail.svg?sprite';

import bgImage from './background.jpg';
import bgImageWebP from './background.webp';

const sections = {
  how: {
    label: 'GFW in Action',
    anchor: 'gfw-in-action',
    component: 'how',
  },
  impacts: {
    label: 'Impacts',
    anchor: 'impacts',
    component: 'impacts',
  },
  history: {
    label: 'History',
    anchor: 'history',
    component: 'history',
  },
  contact: {
    label: 'Contact Us',
    anchor: 'contact',
    component: 'contact',
  },
  partners: {
    label: 'Partnership',
    anchor: 'partnership',
    component: 'partners',
  },
};

const sectionComponents = {
  history: HistorySection,
  impacts: Impacts,
  partners: Partners,
  how: How,
  contact: Contact,
};

const AboutPage = (props) => (
  <div className="l-about-page">
    <Cover
      title="About"
      description="Global Forest Watch, or GFW, is an initiative from the World Resources Institute (WRI) committed to providing the best publicly available data and tools for monitoring and protecting the world’s forests. By harnessing cutting-edge technology, GFW’s free and accessible platform allows anyone anywhere to access near-real-time information on forest change and mobilize action."
      bgImage={bgImage}
      webP={bgImageWebP}
    >
      <Link href="/subscribe">
        <a className="subscribe-btn">
          <Button round className="subscribe-icon">
            <Icon icon={mailIcon} />
          </Button>
          <p className="subscribe-msg">SUBSCRIBE TO THE GFW NEWSLETTER</p>
        </a>
      </Link>
    </Cover>
    <SubnavMenu className="about-links" links={Object.values(sections || {})} />
    <Projects {...props} />
    {sections &&
      Object.keys(sections).map((s) => {
        const section = sections[s];
        const PageComponent = sectionComponents[section.component];
        return PageComponent ? (
          <div
            id={section.anchor}
            className={section.anchor}
            key={section.anchor}
          >
            <PageComponent {...props} />
          </div>
        ) : null;
      })}
    <Join />
  </div>
);

export default AboutPage;
