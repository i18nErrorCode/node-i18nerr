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
  }
};

export const TableType = new GraphQLObjectType({
  name: 'TableType',
  fields: {
    uid: {
      type: new GraphQLNonNull(GraphQLString),
      description: 'uuid of creator'
    },
    name: {
      type: new GraphQLNonNull(GraphQLString),
      description: 'table name'
    }
  }
});
