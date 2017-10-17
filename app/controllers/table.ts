/**
 * Created by axetroy on 17-7-19.
 */
import TableModel from '../postgres/models/table.model';
import sequelize from '../postgres/index';
import { RFC3339NanoMaper, initQuery, sortMap } from '../utils';
import { FormQuery$ } from '../graphql/types/formQuery';

/**
 * 创建table
 * @param {string} uid
 * @param {string} name
 * @returns {Promise<any>}
 */
export async function createTable(uid: string, name: string) {
  const t: any = await sequelize.transaction();
  try {
    const oldRow = await TableModel.findOne({
      where: { uid, name },
      transaction: t,
      lock: t.LOCK.UPDATE
    });

    if (oldRow) {
      throw new Error(`table exist`);
    }

    const row: any = await TableModel.create(
      {
        uid,
        name
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
 * 获取table
 * @param {string} name
 * @returns {Promise<any>}
 */
export async function getTable(name: string) {
  const t: any = await sequelize.transaction();

  try {
    const row = await TableModel.findOne({
      where: {
        name
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
export async function getTableList(query: FormQuery$) {
  let { page, limit, skip, sort, keyJson, songo } = initQuery(query);

  try {
    const result: any = {};
    const queryResult: any = await TableModel.findAndCountAll({
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
