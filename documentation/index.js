import swaggerJsDoc from 'swagger-jsdoc';
import swaggerOptions from './swagger'

const swaggerDocs = swaggerJsDoc(swaggerOptions)

export{
    swaggerDocs
}