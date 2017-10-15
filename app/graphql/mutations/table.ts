/**
 * Created by axetroy on 17-7-14.
 */

import { GraphQLInputObjectType, GraphQLNonNull, GraphQLString } from 'graphql';
import { createTable } from '../../controllers/table';
import { TableType } from '../types/table';

const createTableEntity = {
  type: TableType,
  description: '创建table',
  args: {
    argv: {
      type: new GraphQLInputObjectType({
        name: 'CreateTableArgv',
        fields: {
          name: {
            type: new GraphQLNonNull(GraphQLString)
          }
        }
      })
    }
  },
  async resolve(root: any, { argv }: any, req: any) {
    const { name } = argv;
    const token = req.token;
    console.log(token);
    return await createTable(token.uid, name);
  }
};

export const user = {
  Public: {
    createTable: createTableEntity
  },
  Me: {
    createTable: createTableEntity
  }
};

export const admin = {
  Public: {
    createTable: createTableEntity
  },
  Me: {
    createTable: createTableEntity
  }
};
