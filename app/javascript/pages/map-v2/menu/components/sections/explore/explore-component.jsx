import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';
import isEqual from 'lodash/isEqual';

import SubnavMenu from 'components/subnav-menu';
import Card from 'components/ui/card';
import Loader from 'components/ui/loader';
import SentenceSelector from 'components/sentence-selector';

import './explore-styles.scss';

class Explore extends PureComponent {
  render() {
    const {
      section,
      data,
      setMenuSettings,
      setMapSettings,
      description,
      mapState,
      loading
    } = this.props;
    const links = [
      {
        label: 'Topics',
        active: section === 'topics',
        onClick: () => setMenuSettings({ exploreSection: 'topics' })
      },
      {
        label: 'Places to watch',
        active: section === 'placesToWatch',
        onClick: () => setMenuSettings({ exploreSection: 'placesToWatch' })
      }
    ];

    return (
      <div className="c-explore">
        <SubnavMenu links={links} theme="theme-subnav-small-light" />
        <div className="c-explore__content">
          <div className="row">
            <div className="column small-12">
              <div className="c-explore__description">
                {section === 'placesToWatch' ? (
                  <SentenceSelector
                    sentence={description}
                    options={[{ label: 'June 2017', value: '2017' }]}
                    value="2017"
                  />
                ) : (
                  description
                )}
              </div>
            </div>
            {!loading &&
              data &&
              data.map(item => (
                <div key={item.slug} className="column small-6">
                  <Card
                    theme="theme-card-small"
                    data={{
                      ...item,
                      buttons: [
                        {
                          text: 'READ MORE',
                          extLink: `/topics/${item.slug}`,
                          theme: 'theme-button-light theme-button-small'
                        },
                        {
                          text: 'VIEW ON MAP',
                          onClick: () => {
                            setMapSettings({ ...item.payload });
                          },
                          theme: 'theme-button-small'
                        }
                      ]
                    }}
                    active={isEqual(item.payload, mapState)}
                  />
                </div>
              ))}
            {loading && <Loader />}
          </div>
        </div>
      </div>
    );
  }
}

Explore.propTypes = {
  section: PropTypes.string,
  data: PropTypes.array,
  setMenuSettings: PropTypes.func,
  setMapSettings: PropTypes.func,
  description: PropTypes.string,
  mapState: PropTypes.object,
  loading: PropTypes.bool
};

export default Explore;
