/**
 * Created by axetroy on 17-7-13.
 */
import { GraphQLNonNull, GraphQLString } from 'graphql';
import { getRow } from '../../controllers/row';
import { RowType } from '../types/row';

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

export const user = {
  Public: {},
  Me: {
    row: getRowInfo
  }
};

export const admin = {
  Public: {},
  Me: {
    row: getRowInfo
  }
};
