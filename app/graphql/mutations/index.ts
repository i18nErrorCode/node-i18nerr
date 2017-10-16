/**
 * Created by axetroy on 17-7-13.
 */
import * as _ from 'lodash';
import * as userMutation from './user';
import * as tableMutation from './table';
import * as rowMutation from './row';

interface Node$ {
  Public: any;
  Me: any;
}

interface Interface$ {
  user: Node$;
  admin: Node$;
}

export let user: any = <Node$>{ Public: {}, Me: {} };
export let admin: any = <Node$>{ Public: {}, Me: {} };

[userMutation, tableMutation, rowMutation].forEach((node: Interface$) => {
  user = _.merge({}, user, node.user);
  admin = _.merge({}, admin, node.admin);
});
