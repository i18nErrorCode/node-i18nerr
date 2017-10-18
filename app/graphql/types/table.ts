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

import { generateListType } from './generate-list';
import { user } from './user';

export const TableType = new GraphQLObjectType({
  name: 'TableType',
  fields: {
    id: {
      type: new GraphQLNonNull(GraphQLString),
      description: 'table id'
    },
    uid: {
      type: new GraphQLNonNull(GraphQLString),
      description: 'uuid of creator'
    },
    user: user,
    name: {
      type: new GraphQLNonNull(GraphQLString),
      description: 'table name'
    },
    description: {
      type: new GraphQLNonNull(GraphQLString),
      description: 'table name'
    }
  }
});

export const TableListType = generateListType(TableType);
