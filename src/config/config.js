import joi from 'joi';
import dotenv from 'dotenv';

dotenv.config();

const envValues = joi.object().keys({
  PORT: joi.number()
    .default(3000),
  NODE_ENV: joi.string()
    .default('development')
    .allow('development', 'production', 'test', 'provision'),
  VERSION: joi.string(),
}).unknown().required();

const { error, value } = envValues.validate(process.env);

if (error) {
  throw new Error(`Config validation error: ${error.message}`);
}

const config = {
  port: value.PORT,
  node_env: value.NODE_ENV,
  version: value.VERSION,
};

export default config;
