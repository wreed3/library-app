import { Router } from 'express';
import { UserController } from '../controllers/user.controller';
import { authenticate, authorize } from '../middleware/auth.middleware';

const router = Router();
const userController = new UserController();

router.get('/me', authenticate, userController.getMe);
router.get('/', authenticate, authorize('ADMIN', 'LIBRARIAN'), userController.getAll);
router.put('/:id', authenticate, userController.update);

export default router;