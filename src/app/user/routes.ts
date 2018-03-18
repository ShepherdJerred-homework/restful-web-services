import * as express from 'express';
import * as controller from './controller';

export const router: express.Router = express.Router();

router.get('/', controller.getUsers);

router.get('/:userid', controller.getUser);

router.post('/', controller.addUser);

router.put('/:userid', controller.updateUser);

router.delete('/:userid', controller.deleteUser);
