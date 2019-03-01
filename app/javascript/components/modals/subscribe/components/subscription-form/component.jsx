import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';
import isEqual from 'lodash/isEqual';
import remove from 'lodash/remove';
import { getLanguages } from 'utils/lang';
import cx from 'classnames';

import LayerToggle from 'components/maps/components/legend/components/layer-toggle';
import Dropdown from 'components/ui/dropdown';
import Loader from 'components/ui/loader';
import Button from 'components/ui/button';

import './styles.scss';

class SubscriptionForm extends PureComponent {
  constructor(props) {
    super(props);
    this.state = {
      lang: props.lang,
      name: props.locationName,
      email: props.email
    };
  }

  componentDidMount() {
    const { activeMapDatasets, setSubscribeSettings } = this.props;
    if (activeMapDatasets && activeMapDatasets.length) {
      setSubscribeSettings({ datasets: activeMapDatasets });
    }
  }

  componentDidUpdate(prevProps, prevState) {
    const { activeMapDatasets, setSubscribeSettings } = this.props;

    if (!isEqual(this.state, prevState)) {
      setSubscribeSettings({ ...this.state });
    }

    if (
      activeMapDatasets &&
      activeMapDatasets.length &&
      !isEqual(activeMapDatasets, prevProps.activeMapDatasets)
    ) {
      setSubscribeSettings({ datasets: activeMapDatasets });
    }
  }

  onToggleLayer = dataset => {
    const { activeDatasets, setSubscribeSettings } = this.props;
    const shoudlRemove = activeDatasets.includes(dataset);
    setSubscribeSettings({
      datasets: shoudlRemove
        ? remove(activeDatasets, d => d !== dataset)
        : [...activeDatasets, dataset]
    });
  };

  render() {
    const {
      datasets,
      activeDatasets,
      setModalMetaSettings,
      saveSubscription,
      userData,
      saving,
      error,
      location
    } = this.props;
    const { lang, name, email } = this.state;
    const canSubmit =
      activeDatasets && activeDatasets.length && email && name && lang;

    return (
      <div className="c-form c-subscription-form">
        <div className="field">
          <span>Name*</span>
          <input
            value={name}
            onChange={e => this.setState({ name: e.target.value })}
          />
        </div>
        <div className="field">
          <span>
            Select the forest change alerts you would like to receive*
          </span>
          <div className="datasets">
            {datasets &&
              datasets.map(d => (
                <LayerToggle
                  key={d.id}
                  data={d}
                  onInfoClick={setModalMetaSettings}
                  onToggle={() => this.onToggleLayer(d.subscriptionKey)}
                  showSubtitle
                />
              ))}
          </div>
        </div>
        <div className="field">
          <span>Email*</span>
          <input
            value={email}
            onChange={e => this.setState({ email: e.target.value })}
          />
        </div>
        <div className="field">
          <span>Language*</span>
          <Dropdown
            theme="theme-dropdown-native-form"
            options={getLanguages()}
            value={lang}
            onChange={newLang => this.setState({ lang: newLang })}
            native
          />
        </div>
        <div className="save-subscription">
          {error ? (
            <p className="error-message">
              This service is currently unavailable. Please try again later.
            </p>
          ) : (
            <p>You can always change these settings in MyGFW</p>
          )}
          <Button
            className={cx('submit-btn', { error }, { saving })}
            onClick={() =>
              saveSubscription({
                ...this.state,
                datasets: activeDatasets,
                userData,
                ...location
              })
            }
            disabled={!canSubmit}
          >
            {saving ? <Loader className="saving-btn-loader" /> : 'SAVE'}
          </Button>
        </div>
      </div>
    );
  }
}

SubscriptionForm.propTypes = {
  setSubscribeSettings: PropTypes.func,
  saveSubscription: PropTypes.func,
  datasets: PropTypes.array,
  userData: PropTypes.object,
  setModalMetaSettings: PropTypes.func,
  activeDatasets: PropTypes.array,
  lang: PropTypes.string,
  locationName: PropTypes.string,
  email: PropTypes.string,
  error: PropTypes.bool,
  saving: PropTypes.bool,
  location: PropTypes.object,
  activeMapDatasets: PropTypes.array
};

export default SubscriptionForm;
