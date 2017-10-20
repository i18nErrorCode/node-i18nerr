/**
 * Created by axetroy on 17-7-14.
 */

import {
  GraphQLBoolean,
  GraphQLInputObjectType,
  GraphQLList,
  GraphQLNonNull,
  GraphQLString
} from 'graphql';
import {
  createTable,
  updateTable,
  addMemberByUserName,
  removeMemberByUserName
} from '../../controllers/table';
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
          },
          description: {
            type: new GraphQLNonNull(GraphQLString)
          }
        }
      })
    }
  },
  async resolve(root: any, { argv }: any, req: any) {
    const { name, description } = argv;
    const token = req.token;
    return await createTable({
      uid: token.uid,
      name,
      description
    });
  }
};

const updateTableEntity = {
  type: TableType,
  description: '更新table',
  args: {
    argv: {
      type: new GraphQLInputObjectType({
        name: 'UpdateTableArgv',
        fields: {
          id: {
            type: new GraphQLNonNull(GraphQLString)
          },
          name: {
            type: GraphQLString
          },
          description: {
            type: GraphQLString
          },
          isActive: {
            type: GraphQLBoolean
          }
        }
      })
    }
  },
  async resolve(root: any, { argv }: any, req: any) {
    const { id, name, description, isActive } = argv;
    const token = req.token;
    return await updateTable({ id, uid: token.uid, name, description, isActive });
  }
};

const changeMemberEntity = {
  type: new GraphQLList(GraphQLString),
  description: '添加成员',
  args: {
    argv: {
      type: new GraphQLInputObjectType({
        name: 'ChangeMemberArgv',
        fields: {
          id: {
            type: new GraphQLNonNull(GraphQLString)
          },
          username: {
            type: new GraphQLNonNull(GraphQLString)
          },
          isRemove: {
            type: GraphQLBoolean
          }
        }
      })
    }
  },
  async resolve(root: any, { argv }: any, req: any) {
    const token = req.token;
    const { isRemove, id, username } = argv;
    if (isRemove === true) {
      return await removeMemberByUserName(token.uid, id, username);
    } else {
      return await addMemberByUserName(token.uid, id, username);
    }
  }
};

export const user = {
  Public: {},
  Me: {
    createTable: createTableEntity,
    updateTable: updateTableEntity,
    changeMember: changeMemberEntity
  }
};
