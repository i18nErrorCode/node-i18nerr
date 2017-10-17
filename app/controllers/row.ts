/**
 * Created by axetroy on 17-7-19.
 */
import RowModel from '../postgres/models/row.model';
import sequelize from '../postgres/index';
import { RFC3339NanoMaper, initQuery, sortMap } from '../utils';
import { FormQuery$ } from '../graphql/types/formQuery';

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
export async function getRowList(query: FormQuery$) {
  let { page, limit, skip, sort, keyJson, songo } = initQuery(query);

  try {
    const result: any = {};
    const queryResult: any = await RowModel.findAndCountAll({
      limit,
      offset: limit * page,
      order: sortMap(sort),
      where: {
        ...songo,
        isActive: true
      }
    });
    const rows = queryResult.rows || [];
    const count = queryResult.count || 0;
    const data = rows.map((row: any) => row.dataValues);
    result.data = data;
    result.meta = {
      page,
      limit,
      skip,
      count,
      num: data.length,
      sort,
      keyJson
    };
    return result;
  } catch (err) {
    throw err;
  }
}
