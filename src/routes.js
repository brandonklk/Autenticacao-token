import { Router } from 'express';

import { sendMailWithTokenOfAuth, auth, createUser } from './controllers/UserController';

const routes = Router();

routes.post('/gerar-token-login', sendMailWithTokenOfAuth);
routes.post('/fazer-login', auth);
routes.post('/criar-usuario', createUser);

export default routes;