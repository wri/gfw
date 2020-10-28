import PropTypes from 'prop-types';

import { Carousel } from 'gfw-components';
import { trackEvent } from 'utils/analytics';

import CountryDataProvider from 'providers/country-data-provider';

import Card from 'components/ui/card';

export const TopicsCards = ({
  settings,
  topic,
  cards,
  countries,
  setModalContactUsOpen,
}) => (
  <>
    <CountryDataProvider />
    <Carousel settings={settings}>
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
                      trackEvent({
                        category: 'Topics pages',
                        action: 'Clicks through on a card',
                        label: `${topic}: ${c.title}`,
                      });
                    },
                  },
                ],
              }),
              ...(c.selector && {
                selector: {
                  ...c.selector,
                  options: countries
                    ?.filter(
                      (country) =>
                        !c.selector.whitelist ||
                        c.selector.whitelist.includes(country.value)
                    )
                    ?.map((country) => ({
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
  </>
);

TopicsCards.propTypes = {
  cards: PropTypes.array,
  settings: PropTypes.object,
  topic: PropTypes.string,
  countries: PropTypes.array,
  setModalContactUsOpen: PropTypes.func,
};

export default TopicsCards;
