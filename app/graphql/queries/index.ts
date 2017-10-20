/**
 * Created by axetroy on 17-7-13.
 */
import * as _ from 'lodash';
import * as userQuery from './user';
import * as tableQuery from './table';
import * as rowQuery from './row';

interface Node$ {
  Public: any;
  Me: any;
}

interface Interface$ {
  user: Node$;
  admin: Node$;
}

export let user: any = <Node$>{ Public: {}, Me: {} };

[userQuery, tableQuery, rowQuery].forEach((node: Interface$) => {
  user = _.merge({}, user, node.user);
});
