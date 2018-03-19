import * as express from 'express';
import * as controller from './controller';

export const router: express.Router = express.Router();

router.get('/', controller.getUsers);

router.get('/:userid', controller.getUserFromParameter, controller.getUser);

router.post('/', controller.addUser);

router.put('/:userid', controller.getUserFromParameter, controller.updateUser);

router.delete('/:userid', controller.getUserFromParameter, controller.deleteUser);
