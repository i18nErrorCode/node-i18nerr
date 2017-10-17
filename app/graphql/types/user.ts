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

const UserFields = {
  uid: {
    type: new GraphQLNonNull(GraphQLString),
    description: '用户uuid'
  },
  username: {
    type: new GraphQLNonNull(GraphQLString),
    description: '用户名'
  },
  nickname: {
    type: new GraphQLNonNull(GraphQLString),
    description: '用户昵称'
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
