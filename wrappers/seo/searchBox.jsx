import Head from 'next/head';
import PropTypes from 'prop-types';

const SearchBoxSeo = ({ title, description }) => {
  const NAME = title;
  const IMAGE = 'https://www.globalforestwatch.org/assets/card-2.png';
  const LOGO = 'https://www.globalforestwatch.org/assets/gfw.png';
  const URL = 'https://www.globalforestwatch.org/';
  const SEARCH_TARGET =
    'https://www.globalforestwatch.org/search/?query={search_term_string}';

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
          'https://www.facebook.com/globalforests/',
          'https://www.youtube.com/channel/UCAsamYre1KLulf4FD-xJfLA',
          'https://www.instagram.com/globalforests/',
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
  title: PropTypes.string,
  description: PropTypes.string,
};

export default SearchBoxSeo;
