import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';
import { track } from 'app/analytics';

import Footer from 'components/footer';
import Carousel from 'components/ui/carousel';
import Card from 'components/ui/card';

import './styles.scss';

class TopicsFooter extends PureComponent {
  render() {
    const { cards, topic, setModalContactUsOpen } = this.props;
    return (
      <div className="c-topics-footer">
        <div className="row">
          <div className="column small-12">
            <h3 className="footer-title">{`${topic} RELATED TOOLS`}</h3>
          </div>
        </div>
        <div className="row">
          <div className="column small-12">
            <Carousel>
              {cards &&
                cards.map(c => (
                  <Card
                    key={c.title}
                    theme={c.theme}
                    data={{
                      ...c,
                      buttons: [
                        {
                          text: c.btnText || 'READ MORE',
                          link: c.link,
                          extLink: c.extLink,
                          onClick: () => {
                            if (c.id === 'feedback') {
                              setModalContactUsOpen(true);
                            }
                            track('topicsCardClicked', {
                              label: `${topic}: ${c.title}`
                            });
                          }
                        }
                      ]
                    }}
                  />
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
  topic: PropTypes.string,
  setModalContactUsOpen: PropTypes.func
};

export default TopicsFooter;
