import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';

import SubnavMenu from 'components/subnav-menu';
import Card from 'components/ui/card';

import './explore-styles.scss';

class Explore extends PureComponent {
  render() {
    const { section, data, setMenuExplore } = this.props;
    const links = [
      {
        label: 'Topics',
        active: section === 'topics',
        onClick: () => setMenuExplore({ section: 'topics' })
      },
      {
        label: 'Places to watch',
        active: section === 'places-to-watch',
        onClick: () => setMenuExplore({ section: 'places-to-watch' })
      },
      {
        label: 'Stories',
        active: section === 'stories',
        onClick: () => setMenuExplore({ section: 'stories' })
      }
    ];
    return (
      <div className="c-explore">
        <SubnavMenu links={links} theme="theme-subnav-small-light" />
        <div className="c-explore__content">
          <div className="row">
            <div className="column small-12">
              <div className="c-explore__description">
                Topics are curated map presets for exploring the drivers of
                deforestation and understanding their impacts in ecosystems
                around the world.
              </div>
            </div>
            {data &&
              data.map(item => (
                <div key={item.id} className="column small-6">
                  <Card
                    theme="theme-card-small"
                    data={{
                      ...item,
                      buttons: [
                        {
                          text: 'READ MORE',
                          extLink: '#',
                          theme: 'theme-button-light theme-button-small'
                        },
                        {
                          text: 'VIEW ON MAP',
                          extLink: '#',
                          onClick: () => {},
                          theme: 'theme-button-small'
                        }
                      ]
                    }}
                  />
                </div>
              ))}
          </div>
        </div>
      </div>
    );
  }
}

Explore.propTypes = {
  section: PropTypes.string,
  data: PropTypes.array,
  setMenuExplore: PropTypes.func
};

export default Explore;
