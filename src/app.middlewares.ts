import router from './routes';
import swaggerUi from 'swagger-ui-express';
import swaggerJSDoc from 'swagger-jsdoc';
import { options as swaggerJsdocOptions } from '../configs/swagger';

const swaggerSpec = swaggerJSDoc(swaggerJsdocOptions);

export default [
  (app: any) => app.use('/api', router),
  (app: any) =>
    app.use('/api-doc', swaggerUi.serve, swaggerUi.setup(swaggerSpec)),
];
