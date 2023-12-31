import express from 'express';
import router from './routes';
import swaggerUi from 'swagger-ui-express';
import swaggerJSDoc from 'swagger-jsdoc';
import { options as swaggerJsdocOptions } from '../configs/swagger';

const swaggerSpec = swaggerJSDoc(swaggerJsdocOptions);

export default (app: express.Application) => {
  app.use(express.urlencoded({ extended: false }));
  app.use(express.static(__dirname + '/public'));
  app.use('/api', router);
  app.use('/api-doc', swaggerUi.serve, swaggerUi.setup(swaggerSpec));
};
