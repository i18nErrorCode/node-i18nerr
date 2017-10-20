/**
 * Created by axetroy on 17-7-13.
 */
import { GraphQLNonNull, GraphQLString } from 'graphql';
import { getRow, getRowList } from '../../controllers/row';
import { RowType, RowListType } from '../types/row';
import { FormQuery } from '../types/formQuery';

const getRowInfo = {
  type: RowType,
  description: '获取表信息',
  args: {
    tid: {
      type: new GraphQLNonNull(GraphQLString)
    },
    key: {
      type: new GraphQLNonNull(GraphQLString)
    }
  },
  async resolve(root: any, params: any, req: any) {
    const key: string = params.key;
    const tid: string = params.tid;
    const token = req.token;
    return await getRow(token.uid, tid, key);
  }
};

const getRows = {
  type: RowListType,
  description: '获取表列表',
  args: {
    id: {
      type: new GraphQLNonNull(GraphQLString)
    }
  },
  async resolve(root: any, params: any, req: any) {
    const id = params.id;
    return await getRowList({ limit: 100, keyJson: JSON.stringify({ tid: id }) });
  }
};

export const user = {
  Public: {
    row: getRowInfo,
    rows: getRows
  },
  Me: {
    row: getRowInfo,
    rows: getRows
  }
};

export const admin = {
  Public: {
    row: getRowInfo,
    rows: getRows
  },
  Me: {
    row: getRowInfo,
    rows: getRows
  }
};
