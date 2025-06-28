import Sequelize from 'sequelize';
import config from '../config/database.js';

import Users from './Users.js';
import Ideias from './Ideias.js';

const connection = new Sequelize(config);

Users.init(connection);
Ideias.init(connection);


Users.associate && Users.associate({ Ideias, Users });
Ideias.associate && Ideias.associate({ Users, Ideias });

export default connection;
