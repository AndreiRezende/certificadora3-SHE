import Sequelize, {Model} from 'sequelize'

class Ideias extends Model {
    static init(sequelize){
        super.init(
            {
                title: {
                    type: Sequelize.STRING,
                    allowNull: false
                },

                description: {
                    type: Sequelize.STRING,
                    allowNull: false
                },

                category: {
                    type: Sequelize.STRING,
                    allowNull: false
                },

                status: {
                    type: Sequelize.ENUM('Em análise', 'Aprovada', 'Rejeitada'),
                    allowNull: false,
                    defaultValue: 'Em análise'
                },

                votes: {
                    type: Sequelize.INTEGER,
                    allowNull: false,
                    defaultValue: 0
                },

                user_id: {
                    type: Sequelize.UUID,
                    allowNull: false
                }

            },
        
        {sequelize},

        )
    }

    static associate(models) {
        this.belongsTo(models.Users, { foreignKey: 'user_id', as: 'owner', onDelete: 'CASCADE' });
    }

}

export default Ideias