import { getMetadata } from 'services/metadata';
import { getModalMetaData, setModalMetaData } from '../actions';

jest.mock('services/metadata', () => ({
  getMetadata: jest.fn(),
}));

describe('getModalMetaData', () => {
  afterEach(() => {
    jest.clearAllMocks();
  });

  it('routes with metaType and consumes the normalized metadata field', async () => {
    const dispatch = jest.fn();
    const getState = () => ({ modalMeta: { loading: false } });
    const metadata = { title: 'Tree cover loss' };
    getMetadata.mockResolvedValueOnce({ data: { metadata } });

    await getModalMetaData({
      metakey: 'widget_tree_cover_loss',
      metaType: 'widget',
    })(dispatch, getState);

    expect(getMetadata).toHaveBeenCalledWith(
      'widget_tree_cover_loss',
      'widget'
    );
    expect(dispatch).toHaveBeenCalledWith(setModalMetaData(metadata));
  });
});
