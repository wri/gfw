// eslint-disable-next-line no-unused-vars
import { NextApiRequest, NextApiResponse } from 'next';
import {
  createRequestByGeostoryId,
  getDataByGeostoreId,
  getDataFromLink,
} from 'services/datamart';
import { GFW_DATA_API, GFW_STAGING_DATA_API } from 'utils/apis';

// types
/**
 * @typedef {object} DataLinkObject
 * @property {string} link - The URL to POST the content.
 */

/**
 * @typedef {object} GetResponseObject
 * @property {string} status - status.
 * @property {DataLinkObject} data - data link object.
 */

/**
 * @typedef {object} NotFoundObject
 * @property {string} status - status.
 * @property {string} message - message.
 */
// END types

const ENVIRONMENT = process.env.NEXT_PUBLIC_FEATURE_ENV;

export const DATA_API_URL =
  ENVIRONMENT === 'staging' ? GFW_STAGING_DATA_API : GFW_DATA_API;

/**
 * @param {NextApiRequest} req
 * @param {NextApiResponse} res
 */
const fetchDataByDatasetAndGeostore = async (req, res) => {
  const { query } = req;
  // TODO: add more parameters to the query like, global, adm9, adm1, etc etc etc
  const { slug: slugs, geostore_id, canopy_cover } = query;

  if (slugs.length === 0) {
    res.status(400).send();
    return;
  }

  if (slugs.length === 1) {
    const dataByGeostore = await getDataByGeostoreId({
      dataset: slugs[0],
      geostoreId: geostore_id,
      canopy: canopy_cover,
    });

    res.status(200).send(dataByGeostore);
    return;
  }

  const url = `${DATA_API_URL}/${slugs.join('/')}`;
  try {
    const dataByUrl = await getDataFromLink({ url });

    res.send(dataByUrl);
  } catch (error) {
    res.status(error.response?.status).send({
      status: error.response?.status,
      message: error?.message,
    });
  }
};

/**
 * @param {NextApiRequest} req
 * @param {NextApiResponse} res
 */
const postData = async (req, res) => {
  const { query } = req;
  // TODO: add more parameters to the query like, global, adm9, adm1, etc etc etc
  const { slug: slugs, geostore_id, canopy_cover } = query;

  if (slugs.length === 0) {
    res.status(400).send();
    return;
  }

  try {
    const submitted = await createRequestByGeostoryId({
      dataset: slugs[0],
      geostoreId: geostore_id,
      canopy: canopy_cover,
    });

    res.status(201).send(submitted);
  } catch (error) {
    res.status(error.response?.status).send({
      status: error.response?.status,
      message: error?.message,
    });
  }
};

/**
 * @param {NextApiRequest} req
 * @param {NextApiResponse} res
 */
export default async (req, res) => {
  switch (req.method) {
    case 'POST':
      postData(req, res);
      break;
    case 'GET':
      fetchDataByDatasetAndGeostore(req, res);
      break;
    default:
      res.send(405);
  }
};
