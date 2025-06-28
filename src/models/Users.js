import Sequelize, {Model} from 'sequelize'

class Users extends Model {
    static init(sequelize){
        super.init(
            {
                name: {
                    type: Sequelize.STRING,
                    allowNull: false,
                },

                phone: {
                    type: Sequelize.STRING,
                    allowNull: false,
                    unique: true,
                },

                cpf: {
                    type: Sequelize.STRING,
                    allowNull: false,
                    unique: true,
                },

                email: {
                    type: Sequelize.STRING,
                    allowNull: false,
                    unique: true, 

                },

                password: {
                    type: Sequelize.STRING,
                    allowNull: false,
                },

            },
        
        {sequelize},

        )
    }

    static associate(models) {
        this.hasMany(models.Ideias, { foreignKey: 'user_id', as: 'ideias', onDelete: 'CASCADE', hooks: true });
    }

}

export default Users