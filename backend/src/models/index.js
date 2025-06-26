import sequelize from 'sequelize'

import config from '../config/database.js'

import Users from './Users.js'
import Ideias from './Ideias.js'

const connection = new sequelize(config)

Users.init(connection)
Ideias.init(connection)

export default connection