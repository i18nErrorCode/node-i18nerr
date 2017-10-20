import * as fs from 'fs-extra';
import * as path from 'path';
import { getRowList } from './row';

async function getRawFile(tableId: string, ext: string) {
  const result = await getRowList({
    limit: 100,
    keyJson: JSON.stringify({ tid: tableId })
  });

  const data = result.data;

  // default transform
  let transformer = function(data: any) {
    return 'Can not transform ${ext} file';
  };

  try {
    transformer = require(`./transformer/${ext}`);
  } catch (err) {
    transformer = require(`./transformer/default`);
  }

  transformer = transformer['default'] ? transformer['default'] : transformer;

  return transformer(data);
}

export async function rawHandler(req, res) {
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
}

export async function exportHandler(req, res) {
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
}
