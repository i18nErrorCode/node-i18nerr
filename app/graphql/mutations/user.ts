/**
 * Created by axetroy on 17-7-14.
 */

import { GraphQLInputObjectType, GraphQLNonNull, GraphQLString, GraphQLBoolean } from 'graphql';
import { login, createUser, updateUserInfo } from '../../controllers/user';
import { UserType, RegisterArgv, LoginArgv, LoginType, UpdateUserArgv } from '../types/user';

const loginEntity = {
  type: LoginType,
  description: '登陆',
  args: {
    argv: {
      type: LoginArgv
    }
  },
  async resolve(root: any, { argv }: any, req: any) {
    const { username, password } = argv;
    return await login({ username, password });
  }
};

const registryEntity = {
  type: LoginType,
  description: '注册',
  args: {
    argv: {
      type: RegisterArgv
    }
  },
  async resolve(root: any, { argv }: any, req: any) {
    const { username, password } = argv;
    return await createUser({ username, password });
  }
};

const updateEntity = {
  type: UserType,
  description: '更新用户资料',
  args: {
    argv: {
      type: UpdateUserArgv
    }
  },
  async resolve(root: any, { argv }: any, req: any) {
    const token = req.token;
    const { nickname } = argv;
    return await updateUserInfo({ uid: token.uid, nickname });
  }
};

export const user = {
  Public: {
    registry: registryEntity,
    login: loginEntity
  },
  Me: {
    registry: registryEntity,
    login: loginEntity,
    updateProfile: updateEntity
  }
};

export const admin = {
  Public: {
    registry: registryEntity,
    login: loginEntity
  },
  Me: {
    registry: registryEntity,
    login: loginEntity,
    updateProfile: updateEntity
  }
};
