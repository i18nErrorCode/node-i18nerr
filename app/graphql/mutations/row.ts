/**
 * Created by axetroy on 17-7-14.
 */

import { GraphQLInputObjectType, GraphQLNonNull, GraphQLString } from 'graphql';
import { createRow } from '../../controllers/row';
import { RowType } from '../types/row';

const createRowEntity = {
  type: RowType,
  description: '创建row',
  args: {
    argv: {
      type: new GraphQLInputObjectType({
        name: 'CreateRowArgv',
        fields: {
          tid: {
            type: new GraphQLNonNull(GraphQLString)
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
      })
    }
  },
  async resolve(root: any, { argv }: any, req: any) {
    const { key, tid, value_en, value_cn, value_tw } = argv;
    const token = req.token;
    return await createRow({
      tid,
      uid: token.uid,
      key,
      value_en,
      value_cn,
      value_tw
    });
  }
};

export const user = {
  Public: {
    createRow: createRowEntity
  },
  Me: {
    createRow: createRowEntity
  }
};

export const admin = {
  Public: {
    createRow: createRowEntity
  },
  Me: {
    createRow: createRowEntity
  }
};
