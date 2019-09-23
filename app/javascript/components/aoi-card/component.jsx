import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';
import moment from 'moment';
import cx from 'classnames';

import { formatNumber } from 'utils/format';

import Icon from 'components/ui/icon/icon-component';

import tagIcon from 'assets/icons/tag.svg';
import subscribedIcon from 'assets/icons/subscribed.svg';

import aoiBg from './aoi-bg.png';
import './styles.scss';

const createdMeta = {
  gfw: 'Created {date}',
  fw: 'Create {date} on Forest Watcher',
  map: 'Created {date} on Map Builder'
};

const counts = {
  GLAD: 12352,
  Fires: 221176
};

class AoICard extends PureComponent {
  static propTypes = {
    id: PropTypes.string,
    name: PropTypes.string,
    tags: PropTypes.array,
    image: PropTypes.string,
    application: PropTypes.string,
    createdAt: PropTypes.string,
    simple: PropTypes.bool,
    deforestationAlerts: PropTypes.bool,
    fireAlerts: PropTypes.bool,
    monthlySummary: PropTypes.bool
  };

  render() {
    const {
      id,
      image,
      tags,
      name,
      application,
      createdAt,
      simple,
      deforestationAlerts,
      fireAlerts,
      monthlySummary
    } = this.props;

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
      <div key={id} className={cx('c-aoi-card', { simple })}>
        <img src={image || aoiBg} alt={name} />
        <div className="item-body">
          <p className="title">{name}</p>
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
                <span className="activity-data">
                  {formatNumber({
                    num: counts.GLAD,
                    unit: 'counts'
                  })}
                </span>{' '}
                GLAD alerts
              </span>
              <span className="viirs">
                <span className="activity-data">
                  {formatNumber({
                    num: counts.Fires,
                    unit: 'counts'
                  })}
                </span>{' '}
                VIIRS alerts
              </span>
            </div>
          )}
        </div>
      </div>
    );
  }
}

export default AoICard;
