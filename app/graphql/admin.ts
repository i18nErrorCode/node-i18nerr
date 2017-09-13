/**
 * Created by axetroy on 17-7-13.
 */
import { GraphQLObjectType, GraphQLSchema, GraphQLString } from 'graphql';

import { admin as adminMutation } from './mutations';
import { admin as adminQuery } from './queries';

const args = {
  token: {
    type: GraphQLString
  }
};

/**
 * 扩展req字段
 * @param req
 * @param params
 * @returns {Promise<void>}
 */
async function extendReq(req: any, params: any) {
  const Authentication =
    params.token || req.headers.authentication || req.cookies.Authentication || '';
  req.token = '';
}

export default new GraphQLSchema({
  query: new GraphQLObjectType({
    name: 'Query',
    fields: {
      ['public']: {
        name: 'PublicAdminQuery',
        type: new GraphQLObjectType({
          name: 'PublicAdminQuery',
          fields: adminQuery.Public
        }),
        resolve(root: any, params: any, req: any) {
          return adminQuery.Public;
        }
      },
      me: {
        name: 'MeAdminQuery',
        type: new GraphQLObjectType({
          name: 'MeAdminQuery',
          fields: adminQuery.Me
        }),
        args,
        async resolve(root: any, params: any, req: any) {
          await extendReq(req, params);
          return adminQuery.Me;
        }
      }
    }
  }),
  mutation: new GraphQLObjectType({
    name: 'Mutation',
    fields: {
      ['public']: {
        name: 'AdminPublic',
        type: new GraphQLObjectType({
          name: 'AdminPublicMutation',
          fields: adminMutation.Public
        }),
        args,
        async resolve(root: any, params: any, req: any) {
          await extendReq(req, params);
          return adminMutation.Public;
        }
      },
      me: {
        name: 'MeAdminMutation',
        type: new GraphQLObjectType({
          name: 'MeAdminMutation',
          fields: adminMutation.Me
        }),
        args,
        async resolve(root: any, params: any, req: any) {
          await extendReq(req, params);
          return adminMutation.Me;
        }
      }
    }
  })
});
