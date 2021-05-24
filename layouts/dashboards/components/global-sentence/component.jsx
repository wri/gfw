import { PureComponent } from 'react';
import PropTypes from 'prop-types';

import DynamicSentence from 'components/ui/dynamic-sentence';
import Loader from 'components/ui/loader';

import './styles.scss';

import SENTENCES from 'data/dashboard-summary-sentence';

class GlobalSentence extends PureComponent {
  static propTypes = {
    loading: PropTypes.bool,
    locationNames: PropTypes.object.isRequired,
    location: PropTypes.object.isRequired,
    category: PropTypes.string,
  };

  getLocationType() {
    const { location } = this.props;
    if (location.type === 'country') {
      if (location.adm2) return 'adm2';
      if (location.adm1) return 'adm1';
      return 'country';
    }
    if (location.type === 'global') return 'global';
    return 'area';
  }

  getSentence() {
    const { location, category, locationNames } = this.props;
    if (!location || !category) {
      return { sentence: '', props: {} };
    }

    let sentence;

    try {
      sentence = SENTENCES[this.getLocationType()][category];
    } catch (_i) {
      return {
        sentence: null,
        params: {},
      };
    }

    const sentenceProps = {
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
    };

    return {
      sentence,
      params: sentenceProps,
    };
  }

  render() {
    const { loading } = this.props;

    return (
      <div className="c-widgets dashboard-widgets global-dashboard-sentence">
        <div className="c-widget c-dashboard-sentence-widget">
          {loading && <Loader className="widget-loader" />}
          {!loading && <DynamicSentence sentence={this.getSentence()} />}
        </div>
      </div>
    );
  }
}

export default GlobalSentence;
