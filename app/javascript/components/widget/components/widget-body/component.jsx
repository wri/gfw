import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';
import isEmpty from 'lodash/isEmpty';
import cx from 'classnames';

import Loader from 'components/ui/loader/loader';
import NoContent from 'components/ui/no-content';
import RefreshButton from 'components/ui/refresh-button';
import DynamicSentence from 'components/ui/dynamic-sentence';

import './styles.scss';

class Widget extends PureComponent {
  static propTypes = {
    widget: PropTypes.string.isRequired,
    settings: PropTypes.object,
    config: PropTypes.object.isRequired,
    loading: PropTypes.bool,
    error: PropTypes.bool,
    simple: PropTypes.bool,
    Component: PropTypes.any.isRequired,
    sentence: PropTypes.oneOfType([PropTypes.object, PropTypes.string]),
    data: PropTypes.oneOfType([PropTypes.object, PropTypes.array]),
    dataConfig: PropTypes.object,
    locationName: PropTypes.string,
    parsePayload: PropTypes.func,
    handleMouseOver: PropTypes.func,
    handleMouseOut: PropTypes.func,
    handleRefetchData: PropTypes.func
  };

  render() {
    const {
      loading,
      error,
      simple,
      locationName,
      handleRefetchData,
      handleMouseOver,
      handleMouseOut,
      data,
      dataConfig,
      sentence,
      Component
    } = this.props;
    const hasData = !isEmpty(data);

    return (
      <div className={cx('c-widget-body', { simple })}>
        {loading && <Loader className="widget-loader" />}
        {!loading &&
          !error &&
          !hasData &&
          Component && (
          <NoContent message={`No data in selection for ${locationName}`} />
        )}
        {!loading &&
          error && (
          <RefreshButton refetchFn={handleRefetchData} />
        )}
        {!error &&
          sentence &&
          hasData && (
          <DynamicSentence
            className="sentence"
            sentence={sentence}
            handleMouseOver={handleMouseOver}
            handleMouseOut={handleMouseOut}
          />
        )}
        {!error &&
          hasData &&
          Component && (
          <Component
            {...this.props}
            config={dataConfig}
          />
        )}
      </div>
    );
  }
}

export default Widget;
