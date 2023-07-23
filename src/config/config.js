import joi from 'joi';
import dotenv from 'dotenv';

dotenv.config();

const envValues = joi.object().keys({
  MYSQL_PORT: joi.number()
    .default(3306),
  PORT: joi.number()
    .default(3000),
  MYSQL_HOST: joi.string()
    .default('127.0.0.1'),
  NODE_ENV: joi.string()
    .default('development')
    .allow('development', 'production', 'test', 'provision'),
  VERSION: joi.string(),
  MYSQL_USER: joi.string(),
  MYSQL_PASS: joi.string(),
  MYSQL_DATABASE: joi.string(),
}).unknown().required();

const { error, value } = envValues.validate(process.env);

if (error) {
  throw new Error(`Config validation error: ${error.message}`);
}

const config = {
  port: value.PORT,
  node_env: value.NODE_ENV,
  version: value.VERSION,
  mysqlHost: value.MYSQL_HOST,
  mysqlUser: value.MYSQL_USER,
  mysqlPass: value.MYSQL_PASS,
  mysqlDatabase: value.MYSQL_DATABASE,
};

export default config;
