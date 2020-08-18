import express from 'express'
import bodyParser from 'body-parser'
import swaggerUi from 'swagger-ui-express';
import {swaggerDocs} from '../documentation';
import routes from './routes'
import cors from 'cors'

import dotenv from 'dotenv'
dotenv.config()

//constants
const app = express(),
    PORT = process.env.auth_port,
    basePath = '/api'
    
//cross-origins
app.use((req, res, next)=> {
  res.header("Access-Control-Allow-Origin", '*');
  res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept, auth");
  res.header('Access-Control-Allow-Credentials', true);

next();
});
//Restructuring the body
app.use(bodyParser.urlencoded({ extended: true }))
app.use(bodyParser.json())

//mounting routes
app.use(basePath, routes);
//mounting the documentation
app.use(`${basePath}/documentation`, swaggerUi.serve, swaggerUi.setup(swaggerDocs))




//Not found paths
app.get('**', (req, res) => {
  res.status(404).send({
    status: 404,
    message: `Hey !! You are Welcome to Easy Health Platform, Use the link below for a smooth documentation`,
    data: `${basePath}/documentation`
  });
});


//starting the server
var server = app.listen(PORT,()=>{
     console.log(`server running on port ${PORT}`)
})

export default server
