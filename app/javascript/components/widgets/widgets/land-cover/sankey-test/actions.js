import { getUSLandCover } from 'services/forest-data';

export default () => new Promise(resolve => resolve(getUSLandCover()));
