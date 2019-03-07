import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';

import Footer from 'components/footer';
import Carousel from 'components/ui/carousel';
import Card from 'components/ui/card';
import Button from 'components/ui/button';
import arrowIcon from 'assets/icons/arrow-down.svg';
import Icon from 'components/ui/icon';
import Section from 'pages/topics/components/section';

import './styles.scss';

class TopicsFooter extends PureComponent {
  render() {
    const { cards } = this.props;
    return (
      <Section className="fp-auto-height topics-footer">
        <div className="row">
          <div className="column small-12 medium-12">
            <div className="goToHeader-btn">
              <Button
                onClick={() => {
                  /* global $ */
                  $('#fullpage').fullpage.moveTo('intro', 0);
                }}
              >
                <Icon icon={arrowIcon} />
              </Button>
            </div>
          </div>
        </div>
        <div className="row">
          <div className="column small-12">
            <h2>COMMODITIES RELATED TOOLS</h2>
          </div>
        </div>
        <Carousel>
          {cards &&
            cards.map(c => (
              // "id", "title", "summary", "meta", "image", "imageCredit", "extLink"
              <div key={c.id}>
                <Card
                  key={c.title}
                  data={{
                    ...c,
                    buttons: [
                      {
                        className: 'read-more',
                        text: 'READ MORE',
                        extLink: c.extLink
                      }
                    ]
                  }}
                />
              </div>
            ))}
        </Carousel>
        <Footer />
      </Section>
    );
  }
}

TopicsFooter.propTypes = {
  cards: PropTypes.array
};

export default TopicsFooter;
