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
      type: new GraphQLNonNull(GraphQLString)
    },
    uid: {
      type: new GraphQLNonNull(GraphQLString)
    },
    owner: user,
    name: {
      type: new GraphQLNonNull(GraphQLString)
    },
    description: {
      type: new GraphQLNonNull(GraphQLString)
    },
    member: {
      type: new GraphQLList(
        new GraphQLObjectType({
          name: 'MemberType',
          fields: {
            uid: {
              type: GraphQLString
            },
            username: {
              type: GraphQLString
            }
          }
        })
      )
    },
    createdAt: {
      type: new GraphQLNonNull(GraphQLString)
    },
    updatedAt: {
      type: new GraphQLNonNull(GraphQLString)
    }
  }
});

export const TableListType = generateListType(TableType);
