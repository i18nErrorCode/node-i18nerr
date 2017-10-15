/**
 * Created by axetroy on 2017/7/22.
 */
import * as Sequelize from 'sequelize';
import sequelize from '../index';

const UNIT_KEY = 'uid_name';

const TableModel = sequelize.define('table', {
  id: {
    primaryKey: true,
    type: Sequelize.UUID,
    required: true,
    defaultValue: Sequelize.UUIDV4,
    allowNull: false
  },
  uid: {
    type: Sequelize.UUID,
    required: true,
    unique: UNIT_KEY, // 联合唯一
    allowNull: false
  },
  name: {
    type: Sequelize.STRING,
    required: true,
    allowNull: false,
    unique: UNIT_KEY // 联合唯一
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

export default TableModel;
