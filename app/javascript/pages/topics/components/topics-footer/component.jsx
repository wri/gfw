import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';

import Footer from 'components/footer';
import Carousel from 'components/ui/carousel';
import Card from 'components/ui/card';

import './styles.scss';

class TopicsFooter extends PureComponent {
  render() {
    const { cards, topic } = this.props;
    return (
      <div className="c-topics-footer section">
        <div className="row">
          <div className="column small-12">
            <h2 className="footer-title">{`${topic} RELATED TOOLS`}</h2>
          </div>
        </div>
        <div className="row">
          <div className="column small-12">
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
                            text: c.btnText || 'READ MORE',
                            extLink: c.extLink
                          }
                        ]
                      }}
                    />
                  </div>
                ))}
            </Carousel>
          </div>
        </div>
        <Footer />
      </div>
    );
  }
}

TopicsFooter.propTypes = {
  cards: PropTypes.array,
  topic: PropTypes.string
};

export default TopicsFooter;
