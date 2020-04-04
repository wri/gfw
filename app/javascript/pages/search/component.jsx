import React, { PureComponent } from 'react';
import debounce from 'lodash/debounce';
import PropTypes from 'prop-types';

import { logPageView } from 'app/analytics';
import { Media } from 'utils/responsive';

import treeImage from 'assets/icons/error.svg?sprite';
import Search from 'components/ui/search';
import Button from 'components/ui/button';
import Loader from 'components/ui/loader';
import Icon from 'components/ui/icon';

import './styles.scss';

class SearchPage extends PureComponent {
  static propTypes = {
    query: PropTypes.string,
    data: PropTypes.array,
    loading: PropTypes.bool,
    getSearch: PropTypes.func,
    router: PropTypes.object,
  };

  state = {
    search: this.props.query || '',
  };

  componentDidMount() {
    const { query, getSearch } = this.props;
    if (query) {
      getSearch({ query });
    }
  }

  handleSearchChange = (search) => {
    this.setState({ search });
    this.fetchSearchResults(search);
  };

  fetchSearchResults = debounce((query) => {
    this.props.router.push({ pathname: '/search', query: { query } });
    this.props.getSearch({ query, page: 1 });
    logPageView();
  }, 300);

  render() {
    const { data, loading } = this.props;

    return (
      <div className="l-search-page">
        <div className="search-header">
          <div className="row">
            <div className="column small-12">
              <h1>Search</h1>
            </div>
          </div>
        </div>
        <div className="search-container">
          <div className="row">
            <div className="column small-12 medium-8 medium-offset-2">
              <Search
                className="search-input"
                placeholder="Search"
                input={this.state.search}
                onChange={this.handleSearchChange}
              />
              <div className="search-results">
                {loading && <Loader className="search-loader" />}
                {!loading &&
                  data &&
                  !!data.length &&
                  data.map((item) => (
                    <div
                      key={`${item.title}-${item.cacheId}`}
                      className="search-item"
                    >
                      <div className="item-meta">
                        <a
                          href={item.link}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="notranslate"
                        >
                          <h3>{item.title}</h3>
                        </a>
                        <p className="notranslate">{item.snippet}</p>
                        <a
                          href={item.link}
                          target="_blank"
                          rel="noopener noreferrer"
                        >
                          <Button theme="theme-button-light">MORE</Button>
                        </a>
                      </div>
                      <Media greaterThanOrEqual="md">
                        <div
                          className="item-image"
                          style={{
                            backgroundImage: `url(${
                              item.pagemap &&
                              item.pagemap.cse_image &&
                              item.pagemap.cse_image[0].src
                            })`,
                          }}
                        />
                      </Media>
                    </div>
                  ))}
                {!loading && (!data || data.length === 0) && (
                  <div className="no-results">
                    {this.state.search && (
                      <Icon icon={treeImage} className="error-tree" />
                    )}
                    <p>
                      {this.state.search
                        ? 'No search results.'
                        : 'Enter a search'}
                    </p>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }
}

export default SearchPage;
