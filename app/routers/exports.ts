import * as fs from 'fs-extra';
import * as path from 'path';
import * as express from 'express';

import { getRowList } from '../controllers/row';

async function getRawFile(tableId: string, ext: string) {
  let raw: string = '';
  const result = await getRowList({
    limit: 100,
    keyJson: JSON.stringify({ tid: tableId })
  });

  const data = result.data;

  switch (ext.toLowerCase()) {
    case 'js':
      (async () => {
        const entity = {};
        data.forEach(d => {
          entity[d.key] = {
            en: d.value_en,
            cn: d.value_cn,
            tw: d.value_tw
          };
        });

        raw = `
const i18n = ${JSON.stringify(entity, null, 2)};
module.exports = i18n;`;
      })();

      break;
    case 'ts':
      (async () => {
        const entity = {};
        data.forEach(d => {
          entity[d.key] = {
            en: d.value_en,
            cn: d.value_cn,
            tw: d.value_tw
          };
        });

        raw = `
export interface I18n$ {
  [key:string]: {
    en: string;
    cn: string;
    tw: string;
  }
}
const i18n:I18n$ = ${JSON.stringify(entity, null, 2)};
export default i18n;`;
      })();

      break;
    // json md txt ...
    default:
      (async () => {
        const entity = {};
        data.forEach(d => {
          entity[d.key] = {
            en: d.value_en,
            cn: d.value_cn,
            tw: d.value_tw
          };
        });
        raw = JSON.stringify(entity, null, 2);
      })();
  }
  return raw.trim();
}

export default () => {
  const router = express.Router();

  router.get('/raw/:tid.:ext', async (req, res) => {
    const tid = req.params.tid;
    const ext = req.params.ext;
    try {
      res.setHeader('Content-Type', 'text/html; charset=utf-8');
      const raw: string = await getRawFile(tid, ext);

      res.render('code', {
        code: raw
      });
    } catch (err) {
      res.send(err.message);
    }
  });

  router.get('/export/:tid.:ext', async (req, res) => {
    const tid = req.params.tid;
    const ext = req.params.ext;
    try {
      res.setHeader('Content-Type', 'application/octet-stream; charset=utf-8');

      const newFile: string = path.join(process.cwd(), '.temp', `${tid}.${ext}`);

      await fs.ensureFile(newFile);

      const raw: string = await getRawFile(tid, ext);

      await fs.writeFile(newFile, raw);

      fs.createReadStream(newFile).pipe(res);
    } catch (err) {
      res.send(err.message);
    }
  });
  return router;
};
