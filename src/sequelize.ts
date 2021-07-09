import {Sequelize} from 'sequelize-typescript';
import { config } from './config/config';


const postgress = config.postgress;

// Instantiate new Sequelize instance
export const sequelize = new Sequelize({
  "username": postgress.username,
  "password": postgress.password,
  "database": postgress.database,
  "host":     postgress.host,

  dialect: 'postgres',
  storage: ':memory:',
});
