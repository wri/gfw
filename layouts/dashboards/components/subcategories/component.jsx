import { useState, useMemo, useEffect } from 'react';

import useRouter from 'utils/router';

import TagsList from 'components/tags-list';

import { encodeQueryParams, decodeQueryParams } from 'utils/url';

import CATEGORIES from 'data/categories.json';

// import './styles.scss';

const isServer = typeof window === 'undefined';

const Subcategories = () => {
  const { asPath, query } = useRouter();
  const [initialized, setInitialized] = useState(false);
  const { category, scrollTo } = query;

  const baseUrl = useMemo(() => asPath?.split('?')[0], [asPath]);
  const queryParams = useMemo(() => decodeQueryParams(query), [query]);

  const subcategories = useMemo(
    () => CATEGORIES.find(({ value }) => value === category)?.subcategories,
    [category]
  );

  const targetElements = subcategories?.map(({ value }) => ({
    id: value,
    element: document.getElementById(value),
  }));

  const numTargetElements =
    targetElements?.filter((te) => te.element)?.length || 0;

  const tags = useMemo(
    () =>
      subcategories?.map(({ label, value }) => {
        const linkParams = encodeQueryParams({
          ...queryParams,
          scrollTo: value,
        });

        return {
          id: value,
          name: label,
          link: `${baseUrl}?${linkParams}`,
          shallow: true,
          replace: true,
        };
      }),
    [baseUrl, queryParams, subcategories]
  );

  const scrollToCategory = (categoryId) => {
    const target = targetElements.find(({ id }) => id === categoryId)?.element;
    if (!target) return;

    const scrollTop = window.pageYOffset + target?.getBoundingClientRect().top;
    const scrollOffset = -20;

    window.scrollTo({
      behavior: 'smooth',
      left: 0,
      top: scrollTop + scrollOffset,
    });
  };

  useEffect(() => {
    if (isServer || !numTargetElements) return;
    scrollToCategory(scrollTo);
  }, [scrollTo]);

  useEffect(() => {
    if (isServer || initialized || !numTargetElements) return;
    setInitialized(true);
    scrollToCategory(scrollTo);
  }, [numTargetElements]);

  if (!tags) return null;

  return (
    <div className="c-widgets subcategories">
      <TagsList tags={tags} onClick={scrollToCategory} />
    </div>
  );
};

Subcategories.propTypes = {};

export default Subcategories;
