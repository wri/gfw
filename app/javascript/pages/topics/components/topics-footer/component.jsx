import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';

import Footer from 'components/footer';
import Carousel from 'components/ui/carousel';
import Card from 'components/ui/card';
// import Section from 'pages/topics/components/section';

import './styles.scss';

class TopicsFooter extends PureComponent {
  render() {
    const { cards } = this.props;
    return (
      <div className="c-topics-footer section fp-auto-height-responsive">
        <div className="row">
          <div className="column small-12">
            <h2 className="footer-title">COMMODITIES RELATED TOOLS</h2>
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
      </div>
    );
  }
}

TopicsFooter.propTypes = {
  cards: PropTypes.array
};

export default TopicsFooter;
