import { PureComponent } from 'react';
import PropTypes from 'prop-types';

import DynamicSentence from 'components/ui/dynamic-sentence';

import SENTENCES from 'data/dashboard-summary-sentence';

const isServer = typeof window === 'undefined';

class GlobalSentence extends PureComponent {
  static propTypes = {
    handleSSRLocation: PropTypes.object,
    locationNames: PropTypes.object.isRequired,
    location: PropTypes.object.isRequired,
    category: PropTypes.string,
  };

  getLocationType() {
    const { location, handleSSRLocation } = this.props;
    const useLocation = isServer ? handleSSRLocation : location;

    if (useLocation.type === 'country') {
      if (useLocation.adm2) return 'adm2';
      if (useLocation.adm1) return 'adm1';
      return 'country';
    }
    if (useLocation.type === 'global') return 'global';
    return 'area';
  }

  getSentence() {
    const { location, category, locationNames, handleSSRLocation } = this.props;
    if ((!location && !handleSSRLocation) || !category) {
      return { sentence: '', props: {} };
    }

    const useCat =
      isServer && handleSSRLocation ? handleSSRLocation?.category : category;
    let sentence;

    try {
      sentence = SENTENCES[this.getLocationType()][useCat];
    } catch (_i) {
      return {
        sentence: null,
        params: {},
      };
    }

    let sentenceProps;

    console.log('locationNames.adm0: ', locationNames?.adm0);

    sentenceProps = {
      ...(locationNames?.adm0?.label && {
        location: locationNames?.adm0?.label,
      }),
      ...(locationNames?.adm1?.label && {
        adm1: locationNames?.adm1?.label,
      }),
      ...(locationNames?.adm2?.label && {
        adm2: locationNames?.adm2?.label,
      }),
      ...(locationNames?.adm0?.label && {
        area: locationNames?.adm0?.label,
      }),
      ...(locationNames?.adm0?.value && {
        countryCode: locationNames?.adm0?.value,
      }),
    };

    if (isServer && handleSSRLocation) {
      sentenceProps = {
        ...handleSSRLocation,
        location: handleSSRLocation?.label,
        area: handleSSRLocation?.label,
      };
    }

    return {
      sentence,
      params: sentenceProps,
    };
  }

  render() {
    return (
      <div className="c-widgets dashboard-widgets global-dashboard-sentence">
        <div className="c-widget c-dashboard-sentence-widget">
          <DynamicSentence sentence={this.getSentence()} />
        </div>
      </div>
    );
  }
}

export default GlobalSentence;
