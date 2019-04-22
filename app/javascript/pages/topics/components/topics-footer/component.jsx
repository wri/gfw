import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';
import { track } from 'app/analytics';

import Footer from 'components/footer';
import Carousel from 'components/ui/carousel';
import Card from 'components/ui/card';
import CountryDataProvider from 'providers/country-data-provider';

import './styles.scss';

class TopicsFooter extends PureComponent {
  render() {
    const { cards, topic, setModalContactUsOpen, countries } = this.props;

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
                      ...(c.btnText && {
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
                      }),
                      ...(c.selector && {
                        selector: {
                          ...c.selector,
                          options: c.selector.options.map(o => {
                            const country =
                              countries &&
                              countries.find(adm0 => adm0.value === o.value);
                            return {
                              ...o,
                              label: country && country.label
                            };
                          })
                        }
                      })
                    }}
                  />
                ))}
            </Carousel>
          </div>
        </div>
        <Footer />
        <CountryDataProvider />
      </div>
    );
  }
}

TopicsFooter.propTypes = {
  cards: PropTypes.array,
  topic: PropTypes.string,
  setModalContactUsOpen: PropTypes.func,
  countries: PropTypes.array
};

export default TopicsFooter;
