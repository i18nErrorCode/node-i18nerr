/**
 * Created by axetroy on 17-7-19.
 */
import * as _ from 'lodash';
import UserModel from '../postgres/models/user.model';
import sequelize from '../postgres/index';
import { md5, RFC3339NanoMaper, initQuery, sortMap } from '../utils';
import { FormQuery$ } from '../graphql/types/formQuery';

// service
import { generateToken, verifyToken } from '../service/jwt';

export interface CreateArgv$ {
  username: string;
  password: string;
}

export interface LoginArgv$ {
  username: string;
  password: string;
}

export interface UpdateUserArgv$ {
  uid: string;
  nickname?: string;
}

export async function initUser() {
  try {
    await createUser({ username: '111111', password: '111111' });
  } catch {}
}

/**
 * 创建用户
 * @param {CreateArgv$} argv
 * @returns {Promise<any>}
 */
export async function createUser(argv: CreateArgv$): Promise<any> {
  const { username, password } = argv;
  const t: any = await sequelize.transaction();
  try {
    const existRow: any = await UserModel.findOne({
      where: { username },
      transaction: t,
      lock: {
        level: t.LOCK.UPDATE
      }
    });

    if (existRow) {
      throw new Error(`User exist`);
    }

    const md5Password: string = md5(password);
    const row: any = await UserModel.create(
      {
        username,
        nickname: username,
        password: md5Password
      },
      {
        transaction: t
      }
    );
    const data = row.dataValues;

    data.token = generateToken(row.uid);

    await t.commit();
    return data;
  } catch (err) {
    await t.rollback();
    throw err;
  }
}

/**
 * 登陆
 * @param {LoginArgv$} argv
 * @returns {Promise<any>}
 */
export async function login(argv: LoginArgv$) {
  const { username, password } = argv;
  const t: any = await sequelize.transaction();
  try {
    const row: any = await UserModel.findOne({
      where: { username, password: md5(password) },
      transaction: t,
      lock: {
        level: t.LOCK.UPDATE
      }
    });

    if (!row) {
      throw new Error(`User not exist`);
    }

    await t.commit();

    const data = row.dataValues;

    data.token = generateToken(row.uid);

    await verifyToken(data.token);

    return data;
  } catch (err) {
    await t.rollback();
    throw err;
  }
}

/**
 * 获取用户信息
 * @param {string} uid
 * @returns {Promise<any>}
 */
export async function getUserInfo(uid: string) {
  const t: any = await sequelize.transaction();
  try {
    const row: any = await UserModel.findOne({
      where: { uid },
      transaction: t,
      lock: {
        level: t.LOCK.UPDATE
      }
    });

    if (!row) {
      throw new Error(`User ${uid} not exist!`);
    }

    const data = row.dataValues;
    await t.commit();
    return data;
  } catch (err) {
    await t.rollback();
    throw err;
  }
}

/**
 * get user info by username
 * @param {string} name
 * @returns {Promise<any>}
 */
export async function getUserInfoByName(name: string) {
  const t: any = await sequelize.transaction();
  try {
    const row: any = await UserModel.findOne({
      where: { username: name },
      transaction: t,
      lock: {
        level: t.LOCK.UPDATE
      }
    });

    if (!row) {
      throw new Error(`User ${name} not exist!`);
    }

    const data = row.dataValues;
    await t.commit();
    return data;
  } catch (err) {
    await t.rollback();
    throw err;
  }
}

/**
 * 获取用户列表
 * @returns {Promise<any>}
 */
export async function getUserList(query: FormQuery$) {
  let { page, limit, skip, sort, keyJson, songo } = initQuery(query);

  try {
    const result: any = {};
    const queryResult: any = await UserModel.findAndCountAll({
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

export async function updateUserInfo(argv: UpdateUserArgv$) {
  const { uid, nickname } = argv;
  const t: any = await sequelize.transaction();
  try {
    const row: any = await UserModel.findOne({
      where: { uid },
      transaction: t,
      lock: {
        level: t.LOCK.UPDATE
      }
    });

    if (!row) {
      throw new Error(`User ${name} not exist!`);
    }

    if (_.isString(nickname)) {
      await row.update({ nickname }, { transaction: t, lock: t.LOCK.UPDATE });
    }

    const data = row.dataValues;
    await t.commit();
    return data;
  } catch (err) {
    await t.rollback();
    throw err;
  }
}
