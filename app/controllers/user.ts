/**
 * Created by axetroy on 17-7-19.
 */
import UserModel from '../postgres/models/user.model';
import sequelize from '../postgres/index';
import { md5, RFC3339NanoMaper, initQuery, sortMap } from '../utils';

// service
import { generateToken, verifyToken } from '../service/jwt';

interface CreateArgv$ {
  username: string;
  password: string;
}

interface LoginArgv$ {
  username: string;
  password: string;
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
        level: t.LOCK.UPDATE,
        of: UserModel
      }
    });

    if (existRow) {
      throw new Error(`User exist`);
    }

    const md5Password: string = md5(password);
    const row: any = await UserModel.create(
      {
        username,
        password: md5Password
      },
      {
        transaction: t
      }
    );
    const data = row.dataValues;
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
export async function login(argv: LoginArgv$): Promise<any> {
  const { username, password } = argv;
  const t: any = await sequelize.transaction();
  try {
    const row: any = await UserModel.findOne({
      where: { username, password: md5(password) },
      transaction: t,
      lock: {
        level: t.LOCK.UPDATE,
        of: UserModel
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
export async function getUserInfo(uid: string): Promise<any> {
  const t: any = await sequelize.transaction();
  try {
    const row: any = await UserModel.findOne({
      where: { uid },
      transaction: t,
      lock: {
        level: t.LOCK.UPDATE,
        of: UserModel
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

/**
 * 获取用户列表
 * @returns {Promise<any>}
 */
export async function getUserList(query): Promise<any> {
  const t: any = await sequelize.transaction();
  try {
    const row: any = await UserModel.find({
      where: {},
      transaction: t,
      lock: {
        level: t.LOCK.UPDATE,
        of: UserModel
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
export async function updateUserInfo(): Promise<any> {}
