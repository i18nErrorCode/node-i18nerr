import * as express from 'express';

import { rawHandler, exportHandler } from '../controllers/exports';

export default () => {
  const router = express.Router();
  router.get('/raw/:tid.:ext', rawHandler);
  router.get('/export/:tid.:ext', exportHandler);
  return router;
};
