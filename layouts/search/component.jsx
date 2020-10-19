import React, { useEffect } from 'react';
import PropTypes from 'prop-types';

import { Search } from 'gfw-components';

import { handlePageTrack } from 'analytics';

import treeImage from 'assets/icons/error.svg?sprite';
import Button from 'components/ui/button';
import Loader from 'components/ui/loader';
import Icon from 'components/ui/icon';

import './styles.scss';

const SearchPage = ({
  query,
  data,
  loading,
  isDesktop,
  getSearch,
  setSearchQuery,
}) => {
  useEffect(() => {
    getSearch({ query });
  }, [query]);

  const handleSubmit = (search) => {
    setSearchQuery(search);
    handlePageTrack(`/search/?query=${search}`);
  };

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
              className="search-input notranslate"
              placeholder="Search"
              input={query}
              onSubmit={(e) => handleSubmit(e.target.value)}
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
                      <Button theme="theme-button-light" extLink={item.link}>
                        MORE
                      </Button>
                    </div>
                    {isDesktop && (
                      <div
                        className="item-image"
                        style={{
                          backgroundImage: `url('${
                            item.pagemap &&
                            item.pagemap.cse_image &&
                            item.pagemap.cse_image[0].src
                          }')`,
                        }}
                      />
                    )}
                  </div>
                ))}
              {!loading && (!data || data.length === 0) && (
                <div className="no-results">
                  {query && <Icon icon={treeImage} className="error-tree" />}
                  <p>{query ? 'No search results.' : 'Enter a search'}</p>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

SearchPage.propTypes = {
  query: PropTypes.string,
  data: PropTypes.array,
  isDesktop: PropTypes.bool,
  loading: PropTypes.bool,
  getSearch: PropTypes.func,
  setSearchQuery: PropTypes.func,
};

export default SearchPage;
