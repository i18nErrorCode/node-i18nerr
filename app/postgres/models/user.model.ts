/**
 * Created by axetroy on 2017/7/22.
 */
import * as Sequelize from 'sequelize';
import sequelize from '../index';

const UserModel = sequelize.define('user', {
  uid: {
    primaryKey: true,
    type: Sequelize.UUID,
    required: true,
    defaultValue: Sequelize.UUIDV4,
    unique: true,
    allowNull: false
  },
  username: {
    type: Sequelize.STRING,
    required: true,
    allowNull: false,
    comment: '用户名'
  },
  password: {
    type: Sequelize.STRING,
    required: true,
    allowNull: false,
    comment: '用户密码'
  },
  note: {
    type: Sequelize.STRING,
    required: false,
    allowNull: true,
    defaultValue: '',
    comment: '备注'
  },
  isActive: {
    type: Sequelize.BOOLEAN,
    required: false,
    allowNull: true,
    defaultValue: true,
    comment: '是否激活'
  }
});

export default UserModel;
