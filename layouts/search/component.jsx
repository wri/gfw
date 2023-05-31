import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/router';

import {
  Search,
  Desktop,
  Row,
  Column,
  Button,
  Loader,
} from '@worldresources/gfw-components';

import { trackPage } from 'utils/analytics';
import { getSearchQuery } from 'services/search';

import Cover from 'components/cover';
import Icon from 'components/ui/icon';

import treeImage from 'assets/icons/error.svg?sprite';

import './styles.scss';

const SearchPage = () => {
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
    trackPage(newUrl);
  };

  return (
    <div className="l-search-page">
      <Cover title="Search" />
      <div className="search-container">
        <Row>
          <Column width={[0, 1 / 6]} />
          <Column width={[1, 2 / 3]}>
            <Search
              className="search-input notranslate"
              placeholder="Search"
              input={query}
              onSubmit={handleSubmit}
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
                      <a
                        href={item.link}
                        target="_blank"
                        rel="noopener noreferrer"
                      >
                        <Button light>MORE</Button>
                      </a>
                    </div>
                    <Desktop>
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
                    </Desktop>
                  </div>
                ))}
              {!loading && results?.length === 0 && (
                <div className="no-results">
                  {query && <Icon icon={treeImage} className="error-tree" />}
                  <p>{query ? 'No search results.' : 'Enter a search'}</p>
                </div>
              )}
            </div>
          </Column>
        </Row>
      </div>
    </div>
  );
};

export default SearchPage;
