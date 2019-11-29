import React, { PureComponent, Fragment } from 'react';
import PropTypes from 'prop-types';
import moment from 'moment';
import cx from 'classnames';
import Dotdotdot from 'react-dotdotdot';
import ContentLoader from 'react-content-loader';
import { getLatestAlerts } from 'services/alerts';

import applicationsMeta from 'data/applications.json';

import { formatNumber } from 'utils/format';

import Icon from 'components/ui/icon/icon-component';
import MapGeostore from 'components/map-geostore';

import tagIcon from 'assets/icons/tag.svg';
import subscribedIcon from 'assets/icons/subscribed.svg';

import './styles.scss';

class AoICard extends PureComponent {
  static propTypes = {
    name: PropTypes.string,
    tags: PropTypes.array,
    application: PropTypes.string,
    createdAt: PropTypes.string,
    simple: PropTypes.bool,
    deforestationAlerts: PropTypes.bool,
    fireAlerts: PropTypes.bool,
    monthlySummary: PropTypes.bool,
    location: PropTypes.object,
    onFetchAlerts: PropTypes.func
  };

  state = {
    alerts: {},
    loading: true,
    error: false
  };

  mounted = false;

  componentDidMount() {
    this.mounted = true;

    this.getAlerts();
  }

  componentWillUnmount() {
    this.mounted = false;
  }

  getAlerts = () => {
    const { location, onFetchAlerts } = this.props;
    this.setState({ loading: true });
    getLatestAlerts({
      location,
      params: {
        startDate: moment
          .utc()
          .subtract(2, 'weeks')
          .format('YYYY-MM-DD'),
        endDate: moment.utc().format('YYYY-MM-DD')
      }
    })
      .then(alertsResponse => {
        if (this.mounted) {
          this.setState({
            alerts: alertsResponse,
            loading: false
          });
          if (onFetchAlerts) {
            onFetchAlerts(alertsResponse);
          }
        }
      })
      .catch(() => {
        if (this.mounted) {
          this.setState({
            alerts: {
              glads: 0,
              fires: 0,
              error: true
            },
            loading: false
          });
          if (onFetchAlerts) {
            onFetchAlerts({
              glads: 0,
              fires: 0
            });
          }
        }
      });
  };

  render() {
    const {
      tags,
      name,
      application,
      createdAt,
      simple,
      deforestationAlerts,
      fireAlerts,
      monthlySummary,
      location
    } = this.props;
    const { loading, alerts: { glads, fires, error: dataError } } = this.state;

    const subStatus = [
      {
        label: 'forest change alerts',
        subscribed: deforestationAlerts
      },
      {
        label: 'fire alerts',
        subscribed: fireAlerts
      },
      {
        label: 'mothly summary',
        subscribed: monthlySummary
      }
    ].filter(s => s.subscribed);

    const isSubscribed = deforestationAlerts || fireAlerts || monthlySummary;
    const subscribedToAll = deforestationAlerts && fireAlerts && monthlySummary;

    let subscriptionMessage = 'subscribed to';
    if (subscribedToAll) {
      subscriptionMessage = 'subscribed to all notifications';
    } else if (isSubscribed) {
      subStatus.forEach((s, i) => {
        if (s.subscribed) {
          subscriptionMessage = subscriptionMessage.concat(
            ` ${s.label}${i === subStatus.length - 1 ? '' : ' and'}`
          );
        }
      });
    }
    const applicationName = applicationsMeta[application];
    const createdMetaTemplate = `Created ${moment(createdAt).format(
      'MMM DD YYYY'
    )}${
      application !== 'gfw' && applicationName ? ` on ${applicationName}` : ''
    }`;

    return (
      <div className={cx('c-aoi-card', { simple })}>
        <MapGeostore
          className="aoi-card-map"
          location={location}
          padding={simple ? 15 : 25}
          cursor="pointer"
          small={simple}
        />
        <div className="item-body">
          <Dotdotdot clamp={2} className="title">
            {name}
          </Dotdotdot>
          {!simple && <span className="created">{createdMetaTemplate}</span>}
          <div className="meta">
            {tags &&
              tags.length > 0 && (
              <div className="tags">
                <Icon icon={tagIcon} className="tag-icon" />
                <p>{tags.join(', ')}</p>
              </div>
            )}
            {(deforestationAlerts || fireAlerts || monthlySummary) && (
              <div className="subscribed">
                <Icon icon={subscribedIcon} className="subscribed-icon" />
                <p>{simple ? subscriptionMessage : 'subscribed'}</p>
              </div>
            )}
          </div>
          {!simple && (
            <div className="activity">
              <span className="activity-intro">Last weeks activity:</span>
              {!loading &&
                dataError && (
                <span className="data-error-msg">
                    Sorry, we had trouble finding your alerts!
                </span>
              )}
              {!dataError && (
                <Fragment>
                  <span className="glad">
                    {!loading ? (
                      <Fragment>
                        <span className="activity-data notranslate">
                          {formatNumber({
                            num: glads || 0,
                            unit: 'counts'
                          })}
                        </span>{' '}
                        GLAD alerts
                      </Fragment>
                    ) : (
                      <ContentLoader width="100" height="15">
                        <rect
                          x="0"
                          y="0"
                          rx="2"
                          ry="2"
                          width="100"
                          height="15"
                        />
                      </ContentLoader>
                    )}
                  </span>
                  <span className="viirs">
                    {!loading ? (
                      <Fragment>
                        <span className="activity-data notranslate">
                          {formatNumber({
                            num: fires || 0,
                            unit: 'counts'
                          })}
                        </span>{' '}
                        VIIRS alerts
                      </Fragment>
                    ) : (
                      <ContentLoader width="100" height="15">
                        <rect
                          x="0"
                          y="0"
                          rx="2"
                          ry="2"
                          width="100"
                          height="15"
                        />
                      </ContentLoader>
                    )}
                  </span>
                </Fragment>
              )}
            </div>
          )}
        </div>
      </div>
    );
  }
}

export default AoICard;
