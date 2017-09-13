/**
 * Created by axetroy on 17-7-14.
 */
import { GraphQLType, GraphQLObjectType, GraphQLList } from 'graphql';

import MetaType from './meta';

/**
 * 生成列表的类型
 * 为了方便统一meta信息
 */
export default function generateListType(name: string, item: GraphQLType): GraphQLObjectType {
  return new GraphQLObjectType({
    name: name,
    fields: {
      data: {
        type: new GraphQLList(item),
        description: 'Data list'
      },
      meta: {
        type: MetaType,
        description: 'The meta information for the list'
      }
    }
  });
}
