/**
 * Created by axetroy on 17-7-19.
 */
import RowModel from '../postgres/models/row.model';
import sequelize from '../postgres/index';
import { RFC3339NanoMaper, initQuery, sortMap } from '../utils';

export interface CreateRowArgv$ {
  uid: string;
  tid: string;
  key: string;
  value_en: string;
  value_cn: string;
  value_tw: string;
}

export async function createRow(argv: CreateRowArgv$) {
  const { tid, uid, key, value_cn, value_en, value_tw } = argv;
  const t: any = await sequelize.transaction();
  try {
    const oldRow = await RowModel.findOne({
      where: { tid, uid, key },
      transaction: t,
      lock: t.LOCK.UPDATE
    });

    if (oldRow) {
      throw new Error(`row exist`);
    }

    const row: any = await RowModel.create(
      {
        tid,
        uid,
        key,
        value_en,
        value_cn,
        value_tw
      },
      {
        transaction: t
      }
    );

    await t.commit();

    return row.dataValues;
  } catch (err) {
    await t.rollback();
    throw err;
  }
}

/**
 * 获取row
 * @param {string} uid
 * @param {string} tid
 * @param {string} key
 * @returns {Promise<any>}
 */
export async function getRow(uid: string, tid: string, key: string) {
  const t: any = await sequelize.transaction();

  try {
    const row = await RowModel.findOne({
      where: {
        uid,
        tid,
        key
      },
      transaction: t,
      lock: t.LOCK.UPDATE
    });

    await t.commit();

    return row.dataValues;
  } catch (err) {
    await t.rollback();
    throw err;
  }
}

/**
 * 获取列表
 * @returns {Promise<any>}
 */
export async function getRowList() {
  const t: any = await sequelize.transaction();
  try {
    const row: any = await RowModel.find({
      where: {},
      transaction: t,
      lock: {
        level: t.LOCK.UPDATE
      }
    });
    const data = row.dataValues;
    await t.commit();
    return data;
  } catch (err) {
    await t.rollback();
    throw err;
  }
}
