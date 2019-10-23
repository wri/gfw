import React, { PureComponent, Fragment } from 'react';
import PropTypes from 'prop-types';
import moment from 'moment';
import cx from 'classnames';
import Dotdotdot from 'react-dotdotdot';
import ContentLoader from 'react-content-loader';

import { formatNumber } from 'utils/format';

import Icon from 'components/ui/icon/icon-component';
import MapGeostore from 'components/map-geostore';

import tagIcon from 'assets/icons/tag.svg';
import subscribedIcon from 'assets/icons/subscribed.svg';

import './styles.scss';

const createdMeta = {
  gfw: 'Created {date}',
  fw: 'Create {date} on Forest Watcher',
  map: 'Created {date} on Map Builder'
};

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
    geostore: PropTypes.string,
    loading: PropTypes.bool,
    alerts: PropTypes.object
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
      geostore,
      loading,
      alerts
    } = this.props;
    const { glads, fires } = alerts || {};

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

    return (
      <div className={cx('c-aoi-card', { simple })}>
        <MapGeostore
          className="aoi-card-map"
          geostoreId={geostore}
          padding={simple ? 15 : 25}
          cursor="pointer"
          small={simple}
        />
        <div className="item-body">
          <Dotdotdot clamp={2} className="title">
            {name}
          </Dotdotdot>
          {!simple && (
            <span className="created">
              {createdMeta[application].replace(
                '{date}',
                moment(createdAt).format('MMM DD YYYY')
              )}
            </span>
          )}
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
                    <rect x="0" y="0" rx="2" ry="2" width="100" height="15" />
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
                    <rect x="0" y="0" rx="2" ry="2" width="100" height="15" />
                  </ContentLoader>
                )}
              </span>
            </div>
          )}
        </div>
      </div>
    );
  }
}

export default AoICard;
