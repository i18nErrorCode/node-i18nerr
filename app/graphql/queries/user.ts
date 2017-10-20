/**
 * Created by axetroy on 17-7-13.
 */
import { verifyToken } from '../../service/jwt';
import { getUserInfo } from '../../controllers/user';
import { UserType } from '../types/user';

const getUserInfoEntity = {
  type: UserType,
  description: '获取用户信息',
  async resolve(root: any, params: any, req: any) {
    const info = await verifyToken(req.token);
    return await getUserInfo(info.uid);
  }
};

export default {
  Public: {},
  Me: {
    user: getUserInfoEntity
  }
};
