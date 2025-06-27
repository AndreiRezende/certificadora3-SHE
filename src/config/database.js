export default {
    dialect: 'postgres',
    host: 'localhost', 
    username: 'postgres',
    password: 'postgres',
    database: 'usersdb',
    define: {
        timestamp: true, 
        underscored: true,
        underscoredAll: true,
    }

}