import Head from 'next/head';
import PropTypes from 'prop-types';

import { GFW_DOMAIN } from 'utils/external-links';

const SearchBoxSeo = ({ description }) => {
  const NAME = 'Global Nature Watch';
  const IMAGE = `${GFW_DOMAIN}/assets/card-2.png`;
  const LOGO = `${GFW_DOMAIN}/assets/gfw.png`;
  const URL = `${GFW_DOMAIN}/`;
  const SEARCH_TARGET = `${GFW_DOMAIN}/search/?query={search_term_string}`;

  const ADDRESS = {
    '@type': 'PostalAddress',
    streetAddress: '10 G St NE #800',
    addressLocality: 'Washington DC',
    postalCode: '20002',
    addressCountry: 'United States',
  };

  const SCHEMA = {
    '@context': 'http://schema.org',
    '@graph': [
      {
        '@type': 'Organization',
        name: NAME,
        description,
        image: IMAGE,
        logo: LOGO,
        url: URL,
        telephone: '+12027297600',
        sameAs: [
          'https://twitter.com/globalforests',
          'https://www.facebook.com/globalnaturewatch',
          'https://www.youtube.com/channel/UCAsamYre1KLulf4FD-xJfLA',
          'https://www.instagram.com/globalnaturewatch/',
          'https://en.wikipedia.org/wiki/Global_Forest_Watch',
          'https://www.wikidata.org/wiki/Q22677558',
          'https://www.crunchbase.com/organization/global-forest-watch',
          'https://www.wri.org/our-work/project/global-forest-watch, https://data.globalforestwatch.org/, https://pro.globalforestwatch.org/, https://www.unenvironment.org/resources/toolkits-manuals-and-guides/global-forest-watch',
        ],
        address: ADDRESS,
      },
      {
        '@context': 'https://schema.org',
        '@type': 'WebSite',
        url: URL,
        potentialAction: {
          '@type': 'SearchAction',
          target: SEARCH_TARGET,
          'query-input': 'required name=search_term_string',
        },
      },
    ],
  };

  return (
    <Head>
      <script
        type="application/ld+json"
        // eslint-disable-next-line react/no-danger
        dangerouslySetInnerHTML={{ __html: JSON.stringify(SCHEMA) }}
      />
    </Head>
  );
};

SearchBoxSeo.propTypes = {
  description: PropTypes.string,
};

export default SearchBoxSeo;
