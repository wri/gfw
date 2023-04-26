import React from 'react';
import PropTypes from 'prop-types';

import { Carousel, Row, Column, Desktop, Mobile } from 'gfw-components';

import Card from 'components/ui/card';

import awards0 from 'layouts/about/impacts/images/awards.png';
import awards1 from 'layouts/about/impacts/images/awards1.png';
import awards2 from 'layouts/about/impacts/images/awards2.png';
import awards3 from 'layouts/about/impacts/images/awards3.png';

const awards = [
  {
    img: awards0,
    link: 'http://events.esri.com/conference/sagList/',
    title: 'SAG list',
  },
  {
    img: awards1,
    link: 'http://www.unglobalpulse.org/big-data-climate-challenge-winners-announced',
    title: 'Big data climate challenge',
  },
  {
    img: awards2,
    link: 'http://www.socialtech.org.uk/projects/global-forest-watch/',
    title: 'Social tech',
  },
  {
    img: awards3,
    link: 'http://www.computerworld.com/article/2977562/data-analytics/world-resources-institute.html',
    title: 'WRI',
  },
];

const AboutImpactsSection = ({ impactProjects }) => (
  <section className="l-section-impacts">
    <Row>
      <Column>
        <h3>Impacts</h3>
      </Column>
    </Row>
    <Row>
      <Column>
        <Desktop>
          <Carousel>
            {impactProjects?.map((c) => (
              <Card
                key={c.id}
                data={{
                  ...c,
                  buttons: [
                    {
                      className: 'read-more',
                      text: 'READ MORE',
                      extLink: c.extLink,
                    },
                  ],
                }}
              />
            ))}
          </Carousel>
        </Desktop>
        <Mobile>
          <Carousel
            settings={{
              slidesToShow: 1,
            }}
          >
            {impactProjects?.map((c) => (
              <Card
                key={c.id}
                data={{
                  ...c,
                  buttons: [
                    {
                      className: 'read-more',
                      text: 'READ MORE',
                      extLink: c.extLink,
                    },
                  ],
                }}
              />
            ))}
          </Carousel>
        </Mobile>
      </Column>
    </Row>
    <Row className="awards">
      <Column>
        <h3>Awards</h3>
      </Column>
      {awards.map((l) => (
        <Column className="award-logo" key={l.title} width={[1, 1 / 2, 1 / 4]}>
          <a href={l.link} target="_blank" rel="noopener noreferrer">
            <img alt={l.title} src={l.img} />
          </a>
        </Column>
      ))}
    </Row>
  </section>
);

AboutImpactsSection.propTypes = {
  impactProjects: PropTypes.array.isRequired,
};

export default AboutImpactsSection;
