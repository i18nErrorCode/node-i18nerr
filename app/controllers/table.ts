/**
 * Created by axetroy on 17-7-19.
 */
import * as _ from 'lodash';
import TableModel from '../postgres/models/table.model';
import sequelize from '../postgres/index';
import { initQuery, sortMap } from '../utils';
import { FormQuery$ } from '../graphql/types/formQuery';

import { getUserInfoByName, getUserInfo } from './user';

export interface CreateTableArgv$ {
  uid: string;
  name: string;
  description: string;
}

export interface UpdateTableArgv$ {
  id: string;
  uid?: string;
  name?: string;
  description?: string;
  isActive?: boolean;
}

/**
 * 获取组成员
 * @param {string[]} members
 * @returns {Promise<any[]>}
 */
async function resolveMember(members: string[] = []) {
  const users: any[] = [];
  members = [...members];
  while (members.length) {
    const uid: string = <string>members.shift();
    if (typeof uid !== 'string') continue;
    let userInfo = {};
    try {
      userInfo = await getUserInfo(uid);
    } catch (err) {
      console.log(err);
    }
    users.push(userInfo);
  }
  return users;
}

/**
 * 创建table
 * @param {CreateTableArgv$} argv
 * @returns {Promise<any>}
 */
export async function createTable(argv: CreateTableArgv$) {
  const { uid, name, description } = argv;
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
        description,
        member: [uid]
      },
      {
        transaction: t
      }
    );

    await t.commit();

    const data = row.dataValues;

    data.member = await resolveMember(data.member);

    return row.dataValues;
  } catch (err) {
    await t.rollback();
    throw err;
  }
}

/**
 * 给table添加新成员, 通过用户名的方式
 * @param {string} uid
 * @param {string} id
 * @param {string} newMemberUserName
 * @returns {Promise<Array | any | {type; required; allowNull}>}
 */
export async function addMemberByUserName(uid: string, id: string, newMemberUserName: string) {
  const userInfo = await getUserInfoByName(newMemberUserName);
  return await addMember(uid, id, userInfo.uid);
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
 * 删除组成员
 * @param {string} uid
 * @param {string} id
 * @param {string} newMemberUserName
 * @returns {Promise<any>}
 */
export async function removeMemberByUserName(uid: string, id: string, newMemberUserName: string) {
  const userInfo = await getUserInfoByName(newMemberUserName);
  return await removeMember(uid, id, userInfo.uid);
}

/**
 * 删除组成员
 * @param {string} uid
 * @param {string} id
 * @param {string} oldMemberId
 * @returns {Promise<Array | any | {type; required; allowNull} | {type}>}
 */
export async function removeMember(uid: string, id: string, oldMemberId: string) {
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

    const index = member.findIndex(m => m === oldMemberId);

    const shouldUpdate: boolean = index >= 0 && oldMemberId !== row.uid;

    const newMember = shouldUpdate ? member.splice(index, 1) : member;

    // 创建者始终拥有权限
    if (shouldUpdate) {
      await row.update({ member: newMember }, { transaction: t, lock: t.LOCK.UPDATE });
    }

    await t.commit();

    return newMember;
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
  const { id, uid, name, description, isActive } = argv;
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

    if (_.isString(description)) {
      await row.update({ description }, { transaction: t, lock: t.LOCK.UPDATE });
    }

    if (_.isBoolean(isActive)) {
      await row.update({ isActive }, { transaction: t, lock: t.LOCK.UPDATE });
    }

    await t.commit();

    const data = row.dataValues;

    data.member = await resolveMember(data.member);

    return data;
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

    const data = row.dataValues;

    data.member = await resolveMember(data.member);

    return data;
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

    for (let i = 0; i < data.length; i++) {
      const d = data[i];
      d.member = await resolveMember(d.member);
    }

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
