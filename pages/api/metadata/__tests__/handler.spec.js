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
    jest.restoreAllMocks();
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

  it('encodes the validated dataset key before constructing upstream URLs', async () => {
    const encodeSpy = jest
      .spyOn(global, 'encodeURIComponent')
      .mockReturnValue('encoded-dataset-key');
    axios.get
      .mockResolvedValueOnce({
        data: { data: { metadata: { title: 'Dataset' } } },
      })
      .mockResolvedValueOnce({ data: { data: {} } });
    const res = createResponse();

    await handler({ query: { params: ['valid_dataset-key'] } }, res);

    expect(encodeSpy).toHaveBeenCalledWith('valid_dataset-key');
    expect(axios.get).toHaveBeenNthCalledWith(
      1,
      `${GFW_DATA_API}/dataset/encoded-dataset-key`
    );
    expect(axios.get).toHaveBeenNthCalledWith(
      2,
      `${GFW_DATA_API}/dataset/encoded-dataset-key/latest/metadata`
    );
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

  it('merges non-null latest-version metadata over dataset metadata', async () => {
    axios.get
      .mockResolvedValueOnce({
        data: {
          data: { metadata: { title: 'Dataset', source: 'Dataset source' } },
        },
      })
      .mockResolvedValueOnce({
        data: { data: { title: 'Latest title', source: null } },
      });
    const res = createResponse();

    await handler({ query: { params: ['dataset'] } }, res);

    expect(res.json).toHaveBeenCalledWith({
      metadata: { title: 'Latest title', source: 'Dataset source' },
    });
  });

  it('tolerates a missing latest-version metadata document', async () => {
    axios.get
      .mockResolvedValueOnce({
        data: { data: { metadata: { title: 'Dataset' } } },
      })
      .mockRejectedValueOnce({ response: { status: 404 } });
    const res = createResponse();

    await handler({ query: { params: ['dataset'] } }, res);

    expect(res.status).toHaveBeenCalledWith(200);
    expect(res.json).toHaveBeenCalledWith({
      metadata: { title: 'Dataset' },
    });
  });

  it('returns 502 when latest-version metadata fails upstream', async () => {
    axios.get
      .mockResolvedValueOnce({
        data: { data: { metadata: { title: 'Dataset' } } },
      })
      .mockRejectedValueOnce({
        response: { status: 500 },
        message: 'Upstream failed',
      });
    const res = createResponse();

    await handler({ query: { params: ['dataset'] } }, res);

    expect(res.status).toHaveBeenCalledWith(502);
    expect(res.json).toHaveBeenCalledWith({ error: 'Upstream failed' });
  });

  it('converts legacy Resource Watch semantic errors to 404', async () => {
    axios.get.mockResolvedValueOnce({ data: { error: 'Metadata not found' } });
    const res = createResponse();

    await handler({ query: { params: ['satellite_basemap'] } }, res);

    expect(res.status).toHaveBeenCalledWith(404);
    expect(res.json).toHaveBeenCalledWith({ error: 'Metadata not found' });
  });

  it('rejects multiple path segments before contacting an upstream', async () => {
    const res = createResponse();

    await handler(
      { query: { params: ['dataset', 'latest', 'metadata'] } },
      res
    );

    expect(axios.get).not.toHaveBeenCalled();
    expect(res.status).toHaveBeenCalledWith(400);
    expect(res.json).toHaveBeenCalledWith({ error: 'Invalid path parameter' });
  });

  it('rejects an invalid dataset key before contacting an upstream', async () => {
    const res = createResponse();

    await handler({ query: { params: ['..'] } }, res);

    expect(axios.get).not.toHaveBeenCalled();
    expect(res.status).toHaveBeenCalledWith(400);
    expect(res.json).toHaveBeenCalledWith({ error: 'Invalid path parameter' });
  });
});
