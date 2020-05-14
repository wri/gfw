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
                          options: countries && [{ label: 'Select country', value: 'placeholder' }].concat(countries)
                            .filter(country => !c.selector.whitelist || c.selector.whitelist.includes(country.value))
                            .map(country => ({
                              ...country,
                              path: c.selector.path && c.selector.path.replace('{iso}', country.value)
                            }))
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
