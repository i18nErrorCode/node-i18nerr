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
    uid: {
      type: new GraphQLNonNull(GraphQLString),
      description: 'uuid of creator'
    },
    tid: {
      type: new GraphQLNonNull(GraphQLString),
      description: 'table id'
    },
    key: {
      type: new GraphQLNonNull(GraphQLString),
      description: 'row key'
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
