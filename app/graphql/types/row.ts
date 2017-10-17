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

export const RowType = new GraphQLObjectType({
  name: 'RowType',
  fields: {
    id: {
      type: new GraphQLNonNull(GraphQLString)
    },
    uid: {
      type: new GraphQLNonNull(GraphQLString)
    },
    tid: {
      type: new GraphQLNonNull(GraphQLString),
      description: 'table id'
    },
    key: {
      type: new GraphQLNonNull(GraphQLString)
    },
    value_en: {
      type: new GraphQLNonNull(GraphQLString)
    },
    value_cn: {
      type: new GraphQLNonNull(GraphQLString)
    },
    value_tw: {
      type: new GraphQLNonNull(GraphQLString)
    }
  }
});

export const RowListType = generateListType(RowType);
