import { Sequelize, Model } from 'sequelize';

const sequelize = new Sequelize('modsen_task', 'postgres', 'SuperSasha2101', {
    dialect: 'postgres',
    host: 'localhost',
});

export { sequelize };
