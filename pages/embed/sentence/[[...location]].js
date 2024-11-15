import { useEffect, useState } from 'react';
import PropTypes from 'prop-types';
import uniqBy from 'lodash/uniqBy';

import { parseGadm36Id } from 'utils/gadm';

import { getLocationData } from 'services/location';
import {
  getRegionsProvider,
  getSubRegionsProvider,
  getCategorisedCountries,
  getCountryLinksSerialized,
} from 'services/country';

import LayoutEmbed from 'wrappers/embed';

import {
  getSentenceData,
  parseSentence,
  handleSSRLocationObjects,
} from 'services/sentences';

import DynamicSentence from 'components/ui/dynamic-sentence';

const notFoundProps = {
  error: 404,
  title: 'Dashboard Not Found | Global Forest Watch',
  errorTitle: 'Dashboard Not Found',
};

const ALLOWED_TYPES = ['global', 'country', 'aoi'];

export const getServerSideProps = async ({ params }) => {
  const [type] = params?.location || [];

  if (type && !ALLOWED_TYPES.includes(type)) {
    return {
      props: notFoundProps,
    };
  }

  let countryData = await getCategorisedCountries(true);

  if (!type || type === 'global') {
    // get global data
    const data = await getSentenceData();
    const parsedSentence = parseSentence(data);
    return {
      props: {
        title: 'Global Deforestation Rates & Statistics by Country | GFW',
        location: params?.location,
        locationNames: null,
        locationObj: null,
        globalSentence: parsedSentence,
        geodescriber: JSON.stringify(data),
        countryData: JSON.stringify(countryData),
        description:
          'Explore interactive global tree cover loss charts by country. Analyze global forest data and trends, including land use change, deforestation rates and forest fires.',
      },
    };
  }

  try {
    const locationData = await getLocationData(params?.location);
    const { locationName } = locationData || {};

    if (!locationName) {
      return {
        props: notFoundProps,
      };
    }

    const title = `${locationName} Deforestation Rates & Statistics | GFW`;
    const description = `Explore interactive tree cover loss data charts and analyze ${locationName} forest trends, including land use change, deforestation rates and forest fires.`;
    const noIndex = !['country'].includes(type);
    const [locationType, adm0, lvl1, lvl2] = params?.location;
    const adm1 = lvl1 ? parseInt(lvl1, 10) : null;
    const adm2 = lvl2 ? parseInt(lvl2, 10) : null;
    const data = await getSentenceData({
      type: locationType === 'aoi' ? 'country' : locationType,
      adm0,
      adm1,
      adm2,
      threshold: 30,
      extentYear: 2010,
    });

    if (adm0) {
      const regions = await getRegionsProvider({ adm0 });
      const countryLinks = await getCountryLinksSerialized();
      countryData = {
        ...countryData,
        regions: uniqBy(regions.data).map((row) => ({
          id: parseGadm36Id(row.id).adm1,
          value: parseGadm36Id(row.id).adm1,
          label: row.name,
          name: row.name,
        })),
        countryLinks,
      };
    }

    if (adm1) {
      const subRegions = await getSubRegionsProvider(adm0, adm1);
      countryData = {
        ...countryData,
        subRegions: uniqBy(subRegions.data).map((row) => ({
          id: parseGadm36Id(row.id).adm2,
          value: parseGadm36Id(row.id).adm2,
          label: row.name,
          name: row.name,
        })),
      };
    }

    const { locationNames, locationObj } = handleSSRLocationObjects(
      countryData,
      adm0,
      adm1,
      adm2
    );

    const parsedSentence = parseSentence(data, locationNames, locationObj);

    return {
      props: {
        title,
        description,
        locationNames,
        locationObj,
        globalSentence: parsedSentence,
        geodescriber: JSON.stringify(data),
        countryData: JSON.stringify(countryData),
        noIndex,
      },
    };
  } catch (err) {
    if (err?.response?.status === 401) {
      return {
        props: {
          error: 401,
          title: 'Area is private | Global Forest Watch',
          errorTitle: 'Area is private',
        },
      };
    }

    return {
      props: notFoundProps,
    };
  }
};

const getSentenceClientSide = async (
  locationNames = null,
  locationObj = null
) => {
  const data = await getSentenceData();
  let parsedSentence;
  if (locationNames && locationObj) {
    parsedSentence = parseSentence(data, locationNames, locationObj);
  } else {
    parsedSentence = parseSentence(data);
  }
  return parsedSentence;
};

const SentenceEmbed = (props) => {
  const { geodescriber, globalSentence, locationNames, locationObj } = props;
  const [sentence, setSentence] = useState(null);

  useEffect(() => {
    let mounted = true;
    getSentenceClientSide(locationNames, locationObj).then((payload) => {
      if (mounted) {
        setSentence(payload);
      }
    });
    return () => {
      mounted = false;
    };
  }, []);
  return (
    <LayoutEmbed {...props} noIndex>
      <DynamicSentence
        className="sentence"
        testId="sentence"
        sentence={{
          ...(!sentence
            ? {
                params: {},
                sentence: 'Loading dynamic sentence...',
              }
            : sentence),
        }}
      />
      <DynamicSentence
        className="sentence"
        testId="sentence-ssr"
        sentence={{
          params: {
            ...globalSentence.params,
            SSR: 'SSR Generated:',
          },
          sentence: `{SSR} ${globalSentence.sentence}`,
        }}
      />
      <pre data-test="sentence-payload">
        {JSON.stringify(JSON.parse(geodescriber), null, 2)}
      </pre>
    </LayoutEmbed>
  );
};

SentenceEmbed.propTypes = {
  title: PropTypes.string,
  locationNames: PropTypes.object,
  locationObj: PropTypes.object,
  globalSentence: PropTypes.object,
  geodescriber: PropTypes.string,
  countryData: PropTypes.string,
};

export default SentenceEmbed;
