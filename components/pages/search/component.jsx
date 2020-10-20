import React, { useEffect, useState } from 'react';
import PropTypes from 'prop-types';
import { useRouter } from 'next/router';

import { Search } from 'gfw-components';

import { handlePageTrack } from 'analytics';

import treeImage from 'assets/icons/error.svg?sprite';
import Button from 'components/ui/button';
import Loader from 'components/ui/loader';
import Icon from 'components/ui/icon';

import { getSearchQuery } from 'services/search';

import './styles.scss';

const SearchPage = ({ data, isDesktop }) => {
  const {
    query: { query },
    replace,
  } = useRouter();

  const [results, setResults] = useState([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const fetchResults = async () => {
      setLoading(true);
      const resultsResponse = await getSearchQuery({ query });
      setResults(resultsResponse?.data?.items || []);
      setLoading(false);
    };

    if (query) {
      fetchResults();
    } else {
      setResults([]);
    }
  }, [query]);

  const handleSubmit = (search) => {
    const newUrl = `/search?query=${search}`;
    replace(newUrl);
    handlePageTrack(newUrl);
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
                results?.map((item) => (
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
  data: PropTypes.array,
  isDesktop: PropTypes.bool,
};

export default SearchPage;
