import * as express from 'express';

import { rawHandler, exportHandler, rawMultipleFile } from '../controllers/exports';

export default () => {
  const router = express.Router();
  router.get('/raw/:tid.:ext', rawHandler);
  router.get('/raw/multi/:jsonstr', rawMultipleFile);
  router.get('/export/:tid.:ext', exportHandler);
  return router;
};
