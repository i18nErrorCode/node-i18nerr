/**
 * Created by axetroy on 17-7-13.
 */
import { GraphQLBoolean, GraphQLNonNull, GraphQLString } from 'graphql';
import { hasMember, getTable, getTableList, getTableByName } from '../../controllers/table';
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

const getTableInfoByName = {
  type: TableType,
  description: '通过名字获取表信息',
  args: {
    name: {
      type: new GraphQLNonNull(GraphQLString)
    }
  },
  async resolve(root: any, params: any, req: any) {
    return await getTableByName(params.name);
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

const hasMemberEntity = {
  type: GraphQLBoolean,
  description: '验证用户是否在一个表的成员组中',
  args: {
    tid: {
      type: new GraphQLNonNull(GraphQLString)
    }
  },
  async resolve(root: any, params: any, req: any) {
    const token = req.token;
    return await hasMember(params.tid, token.uid);
  }
};

export default {
  Public: {
    table: getTableInfo,
    tableByName: getTableInfoByName,
    tables: getTables
  },
  Me: {
    haveMember: hasMemberEntity
  }
};
