import router from './routes';

export default [(app: any) => app.use('/api', router)];
