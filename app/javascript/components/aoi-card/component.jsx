import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';
import moment from 'moment';
import cx from 'classnames';
import Link from 'redux-first-router-link';

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
    index: PropTypes.number,
    id: PropTypes.string,
    name: PropTypes.string,
    tags: PropTypes.array,
    image: PropTypes.string,
    application: PropTypes.string,
    createdAt: PropTypes.string,
    simple: PropTypes.bool
  };

  render() {
    const {
      index,
      id,
      image,
      tags,
      name,
      application,
      createdAt,
      simple
    } = this.props;

    return (
      <div key={id} className={cx('c-aoi-card', { simple })}>
        <Link to={`/dashboards/aoi/${id}`}>
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
              {(index + 1) % 3 === 0 && ( // TODO: get subscribed status from API
                <div className="subscribed">
                  <Icon icon={subscribedIcon} className="subscribed-icon" />
                  <p>Subscribed</p>
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
        </Link>
      </div>
    );
  }
}

export default AoICard;
