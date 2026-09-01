import axios from 'axios';
import { GFW_DATA_API, GFW_METADATA_API } from 'utils/apis';
import handler from '../[...params]';

jest.mock('axios');

const createResponse = () => {
  const res = {};
  res.status = jest.fn(() => res);
  res.json = jest.fn(() => res);
  return res;
};

describe('metadata API', () => {
  afterEach(() => {
    jest.clearAllMocks();
  });

  it('accepts a valid Data API key without a local whitelist entry', async () => {
    const dataset = {
      data: {
        data: {
          id: 'new_dataset',
          metadata: { title: 'New dataset' },
        },
      },
    };
    axios.get
      .mockResolvedValueOnce(dataset)
      .mockResolvedValueOnce({ data: { data: {} } });
    const res = createResponse();

    await handler({ query: { params: ['new_dataset'] } }, res);

    expect(axios.get).toHaveBeenNthCalledWith(
      1,
      `${GFW_DATA_API}/dataset/new_dataset`
    );
    expect(res.status).toHaveBeenCalledWith(200);
    expect(res.json).toHaveBeenCalledWith({
      id: 'new_dataset',
      metadata: { title: 'New dataset' },
    });
  });

  it('preserves legacy Resource Watch exception routing', async () => {
    axios.get.mockResolvedValueOnce({ data: { title: 'Satellite basemap' } });
    const res = createResponse();

    await handler({ query: { params: ['satellite_basemap'] } }, res);

    expect(axios.get).toHaveBeenCalledWith(
      `${GFW_METADATA_API}/satellite_basemap`
    );
    expect(res.json).toHaveBeenCalledWith({
      metadata: { title: 'Satellite basemap' },
    });
  });

  it('returns 404 when the Data API reports missing metadata', async () => {
    axios.get.mockRejectedValueOnce({
      response: { status: 404 },
      message: 'Not found',
    });
    const res = createResponse();

    await handler({ query: { params: ['missing_dataset'] } }, res);

    expect(res.status).toHaveBeenCalledWith(404);
    expect(res.json).toHaveBeenCalledWith({ error: 'Metadata not found' });
  });

  it('rejects invalid paths before contacting an upstream', async () => {
    const res = createResponse();

    await handler({ query: { params: ['..', 'metadata'] } }, res);

    expect(axios.get).not.toHaveBeenCalled();
    expect(res.status).toHaveBeenCalledWith(400);
  });
});
