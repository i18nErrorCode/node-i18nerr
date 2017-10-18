/**
 * Created by axetroy on 17-7-19.
 */
import * as _ from 'lodash';
import TableModel from '../postgres/models/table.model';
import sequelize from '../postgres/index';
import { RFC3339NanoMaper, initQuery, sortMap } from '../utils';
import { FormQuery$ } from '../graphql/types/formQuery';

export interface UpdateTableArgv$ {
  id: string;
  uid?: string;
  name?: string;
  isActive?: boolean;
}

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
        name,
        member: [uid]
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
 * 给table添加新成员
 * @param {string} uid
 * @param {string} id
 * @param {string} newMemberId
 * @returns {Promise<Array | any | {type; required; allowNull}>}
 */
export async function addMember(uid: string, id: string, newMemberId: string) {
  const t: any = await sequelize.transaction();
  try {
    const row = await TableModel.findOne({
      where: {
        id,
        uid
      },
      transaction: t,
      lock: t.LOCK.UPDATE
    });

    if (!row) {
      throw new Error(`No data`);
    }

    const member = row.member || [];

    member.push(newMemberId);

    await row.update({ member }, { transaction: t, lock: t.LOCK.UPDATE });

    await t.commit();

    return member;
  } catch (err) {
    await t.rollback();
    throw err;
  }
}

/**
 * 更新table
 * @param {UpdateTableArgv$} argv
 * @returns {Promise<any>}
 */
export async function updateTable(argv: UpdateTableArgv$) {
  const { id, uid, name, isActive } = argv;
  const t: any = await sequelize.transaction();

  try {
    const row = await TableModel.findOne({
      where: {
        id,
        uid
      },
      transaction: t,
      lock: t.LOCK.UPDATE
    });

    if (!row) {
      throw new Error(`No data`);
    }

    // 校验用户是否有权限更改table
    if (row !== uid && row.member.includes(uid) === false) {
      throw new Error(`Permission deny`);
    }

    if (_.isString(name)) {
      await row.update({ name }, { transaction: t, lock: t.LOCK.UPDATE });
    }

    if (_.isBoolean(isActive)) {
      await row.update({ isActive }, { transaction: t, lock: t.LOCK.UPDATE });
    }

    await t.commit();

    return row.dataValues;
  } catch (err) {
    await t.rollback();
    throw err;
  }
}

/**
 * 获取table
 * @param {string} id
 * @returns {Promise<any>}
 */
export async function getTable(id: string) {
  const t: any = await sequelize.transaction();

  try {
    const row = await TableModel.findOne({
      where: {
        id
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
export async function getTableList(query: FormQuery$, filter = {}) {
  let { page, limit, skip, sort, keyJson, songo } = initQuery(query);

  try {
    const result: any = {};
    const queryResult: any = await TableModel.findAndCountAll({
      limit,
      offset: limit * page,
      order: sortMap(sort),
      where: {
        ...songo,
        ...filter,
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
