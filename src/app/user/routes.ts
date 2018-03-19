import * as express from 'express';
import * as controller from './controller';

export const router: express.Router = express.Router();

router.get('/', controller.authenticate, controller.checkUserIsTeacher, controller.getUsers);

router.get('/:userid', controller.authenticate, controller.checkUserIsTeacher, controller.getUserFromParameter, controller.getUser);

router.post('/', controller.authenticate, controller.checkUserIsAdmin, controller.addUser);

router.put('/:userid', controller.authenticate, controller.checkUserIsAdmin, controller.getUserFromParameter, controller.updateUser);

router.delete('/:userid', controller.authenticate, controller.checkUserIsAdmin, controller.getUserFromParameter, controller.deleteUser);
