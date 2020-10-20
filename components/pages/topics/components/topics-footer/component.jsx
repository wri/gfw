import PropTypes from 'prop-types';
import { track } from 'analytics';

import { Carousel, Row, Column } from 'gfw-components';

import CountryDataProvider from 'providers/country-data-provider';

import Footer from 'components/footer';
import Card from 'components/ui/card';
import { setModalContactUsOpen } from 'components/modals/contact-us/actions';

import './styles.scss';

const TopicsFooter = ({ cards, topic, countries }) => (
  <div className="c-topics-footer">
    <Row>
      <Column>
        <h3 className="footer-title">{`${topic} RELATED TOOLS`}</h3>
      </Column>
    </Row>
    <Row className="row-cards">
      <Column>
        <Carousel>
          {cards &&
            cards.map((c) => (
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
                            label: `${topic}: ${c.title}`,
                          });
                        },
                      },
                    ],
                  }),
                  ...(c.selector && {
                    selector: {
                      ...c.selector,
                      options:
                        countries &&
                        [{ label: 'Select country', value: 'placeholder' }]
                          .concat(countries)
                          .filter(
                            (country) =>
                              !c.selector.whitelist ||
                              c.selector.whitelist.includes(country.value)
                          )
                          .map((country) => ({
                            ...country,
                            path:
                              c.selector.path &&
                              c.selector.path.replace('{iso}', country.value),
                          })),
                    },
                  }),
                }}
              />
            ))}
        </Carousel>
      </Column>
    </Row>
    <Footer />
    <CountryDataProvider />
  </div>
);

TopicsFooter.propTypes = {
  cards: PropTypes.array,
  topic: PropTypes.string,
  countries: PropTypes.array,
};

export default TopicsFooter;
