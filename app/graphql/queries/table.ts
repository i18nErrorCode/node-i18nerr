/**
 * Created by axetroy on 17-7-13.
 */
import { GraphQLNonNull, GraphQLString } from 'graphql';
import { getTable } from '../../controllers/table';
import { TableType } from '../types/table';

const getTableInfo = {
  type: TableType,
  description: '获取表信息',
  args: {
    name: {
      type: new GraphQLNonNull(GraphQLString)
    }
  },
  async resolve(root: any, params: any, req: any) {
    return await getTable(params.name);
  }
};

export const user = {
  Public: {
    table: getTableInfo
  },
  Me: {
    table: getTableInfo
  }
};

export const admin = {
  Public: {
    table: getTableInfo
  },
  Me: {
    table: getTableInfo
  }
};
