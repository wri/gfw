import { jest } from '@jest/globals';
import { getMetadata } from 'services/metadata';
import {
  getModalMetaData,
  setModalMetaData,
  setModalMetaLoading,
} from '../actions';

jest.mock('services/metadata', () => ({
  getMetadata: jest.fn(),
}));

describe('getModalMetaData', () => {
  const buildStateGetter =
    (overrides = {}) =>
    () => ({
      modalMeta: { loading: false, ...overrides },
    });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('dispatches response.data.metadata for a dataset key, passing only the bare key', async () => {
    const dispatch = jest.fn();
    const metadata = { title: 'Tree cover loss' };
    getMetadata.mockResolvedValueOnce({ data: { metadata } });

    getModalMetaData({ metakey: 'umd_tree_cover_loss' })(
      dispatch,
      buildStateGetter()
    );

    // allow the getMetadata promise to resolve
    await Promise.resolve();
    await Promise.resolve();

    expect(getMetadata).toHaveBeenCalledWith('umd_tree_cover_loss');
    expect(dispatch).toHaveBeenCalledWith(setModalMetaData(metadata));
  });

  it('dispatches response.data.metadata for a widget key identically to a dataset key, with no type argument', async () => {
    const dispatch = jest.fn();
    const metadata = { title: 'Tree cover loss (widget)' };
    getMetadata.mockResolvedValueOnce({ data: { metadata } });

    getModalMetaData({ metakey: 'widget_tree_cover_loss' })(
      dispatch,
      buildStateGetter()
    );

    await Promise.resolve();
    await Promise.resolve();

    // getMetadata now takes a single argument for every key: no backend
    // type is declared or inferred anywhere in this call chain.
    expect(getMetadata).toHaveBeenCalledWith('widget_tree_cover_loss');
    expect(getMetadata.mock.calls[0]).toHaveLength(1);
    expect(dispatch).toHaveBeenCalledWith(setModalMetaData(metadata));
  });

  it('sets loading false and error true when the request fails', async () => {
    const dispatch = jest.fn();
    getMetadata.mockRejectedValueOnce(new Error('boom'));

    getModalMetaData({ metakey: 'widget_tree_cover_loss' })(
      dispatch,
      buildStateGetter()
    );

    await Promise.resolve();
    await Promise.resolve();

    expect(dispatch).toHaveBeenCalledWith(
      setModalMetaLoading({ loading: false, error: true })
    );
  });

  it('does not fetch metadata when a request is already loading', () => {
    const dispatch = jest.fn();

    getModalMetaData({ metakey: 'widget_tree_cover_loss' })(
      dispatch,
      buildStateGetter({ loading: true })
    );

    expect(getMetadata).not.toHaveBeenCalled();
  });
});
