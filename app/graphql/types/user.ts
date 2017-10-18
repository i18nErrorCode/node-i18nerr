/**
 * Created by axetroy on 17-7-13.
 */
import {
  GraphQLObjectType,
  GraphQLNonNull,
  GraphQLString,
  GraphQLID,
  GraphQLBoolean,
  GraphQLList,
  GraphQLInt,
  GraphQLInputObjectType
} from 'graphql';

import { getUserInfo } from '../../controllers/user';

export const user = {
  type: new GraphQLObjectType({
    name: 'UserInfoType',
    fields: {
      uid: {
        type: GraphQLString
      },
      username: {
        type: GraphQLString
      }
    }
  }),
  async resolve(parent: any, params: any, req: any) {
    const uid: string = parent.uid;
    let userInfo = {};
    try {
      userInfo = await getUserInfo(uid);
    } catch (err) {
      console.error(err);
    }
    return userInfo;
  }
};

export const UserType = new GraphQLObjectType({
  name: 'UserType',
  fields: {
    uid: {
      type: new GraphQLNonNull(GraphQLString)
    },
    username: {
      type: new GraphQLNonNull(GraphQLString)
    },
    nickname: {
      type: new GraphQLNonNull(GraphQLString)
    }
  }
});

export const LoginType = new GraphQLObjectType({
  name: 'LoginType',
  fields: {
    uid: {
      type: new GraphQLNonNull(GraphQLString)
    },
    username: {
      type: new GraphQLNonNull(GraphQLString)
    },
    nickname: {
      type: new GraphQLNonNull(GraphQLString)
    },
    token: {
      type: new GraphQLNonNull(GraphQLString),
      description: 'Token'
    }
  }
});

export const RegisterArgv = new GraphQLInputObjectType({
  name: 'RegistryArgv',
  fields: {
    username: {
      type: new GraphQLNonNull(GraphQLString)
    },
    password: {
      type: new GraphQLNonNull(GraphQLString)
    }
  }
});

export const LoginArgv = new GraphQLInputObjectType({
  name: 'LoginArgv',
  fields: {
    username: {
      type: new GraphQLNonNull(GraphQLString)
    },
    password: {
      type: new GraphQLNonNull(GraphQLString)
    }
  }
});
