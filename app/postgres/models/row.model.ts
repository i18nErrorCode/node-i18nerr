/**
 * Created by axetroy on 2017/7/22.
 */
import * as Sequelize from 'sequelize';
import sequelize from '../index';

const UNIT_KEY = 'tablekey_rowkey';

const RowModel = sequelize.define('row', {
  id: {
    primaryKey: true,
    type: Sequelize.UUID,
    required: true,
    defaultValue: Sequelize.UUIDV4,
    allowNull: false
  },
  tid: {
    type: Sequelize.UUID,
    required: true,
    unique: UNIT_KEY, // 联合唯一
    allowNull: false
  },
  uid: {
    type: Sequelize.UUID,
    required: true,
    allowNull: false
  },
  code: {
    type: Sequelize.INTEGER,
    autoIncrement: true,
    allowNull: false
  },
  key: {
    type: Sequelize.STRING,
    required: true,
    allowNull: false,
    unique: UNIT_KEY // 联合唯一
  },
  value_en: {
    type: Sequelize.STRING,
    required: true,
    allowNull: false
  },
  value_cn: {
    type: Sequelize.STRING,
    required: true,
    allowNull: false
  },
  value_tw: {
    type: Sequelize.STRING,
    required: true,
    allowNull: false
  },
  note: {
    type: Sequelize.STRING,
    required: false,
    allowNull: true,
    defaultValue: ''
  },
  isActive: {
    type: Sequelize.BOOLEAN,
    required: false,
    allowNull: true,
    defaultValue: true
  }
});

export default RowModel;
