import dotenv from 'dotenv'
import env from '../config/config.json'
dotenv.config()
const envVar = process.env.NODE_ENV
const config = () => {
      let environment ={}
      if ( envVar === 'docker' ){
        environment.username = process.env.POSTGRES_USER
        environment.password = process.env.POSTGRES_PASSWORD
        environment.database = process.env.POSTGRES_DB
        environment.host = process.env.DB_HOST
        environment.dialect = process.env.DB_DIALECT
      }

      else if(envVar === 'production'){
        environment.use_env_variable="DATABASE_URL",
        environment.dialect='postgres'
      }

      else 
      {
        console.log(`Connecting to ${envVar} db`)
        environment = env[envVar]
      }
        return environment
  }

module.exports= config;