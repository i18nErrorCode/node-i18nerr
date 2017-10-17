/**
 * Created by axetroy on 17-7-13.
 */
import { GraphQLNonNull, GraphQLString } from 'graphql';
import { getTable, getTableList } from '../../controllers/table';
import { TableType, TableListType } from '../types/table';
import { FormQuery } from '../types/formQuery';

const getTableInfo = {
  type: TableType,
  description: '获取表信息',
  args: {
    id: {
      type: new GraphQLNonNull(GraphQLString)
    }
  },
  async resolve(root: any, params: any, req: any) {
    return await getTable(params.id);
  }
};

const getTables = {
  type: TableListType,
  description: '获取表列表',
  args: {
    query: {
      name: 'query',
      type: new GraphQLNonNull(FormQuery)
    }
  },
  async resolve(root: any, params: any, req: any) {
    return await getTableList(params.query);
  }
};

export const user = {
  Public: {
    table: getTableInfo,
    tables: getTables
  },
  Me: {
    table: getTableInfo,
    tables: getTables
  }
};

export const admin = {
  Public: {
    table: getTableInfo,
    tables: getTables
  },
  Me: {
    table: getTableInfo,
    tables: getTables
  }
};
